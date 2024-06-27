import CryptoJS from "crypto-js";
import supabase from './supabaseClient';

export const checkUserExists = async (email) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, password')
        .eq('email', email)
        .single();

    return { data, error };
};

export const signup = async (firstName, lastName, email, hashedPassword) => {
    const exists = await checkUserExists(email);
    if (exists.data) {
        return { error: { message: 'Email is already in use' } };
    }

    const { data, error } = await supabase.from('users').insert([
        { first_name: firstName, last_name: lastName, email, password: hashedPassword }
    ]);

    return { data, error };
};

export const validatePassword = (hashedPassword, storedHashedPassword) => {
    return hashedPassword === storedHashedPassword;
};

export const resetPassword = async (email, newPassword) => {
    const hashedPassword = CryptoJS.SHA256(newPassword).toString();

    const { data, error } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('email', email);

    if (error) {
        throw new Error(error.message);
    }
    return data;
};

export const addPost = async (userId, title, description, imageUrl) => {
    try {
        // Get current UTC timestamp
        const currentDateUTC = new Date().toISOString();
        
        // Convert UTC timestamp to local time
        const currentDateLocal = new Date(currentDateUTC).toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
        
        // Send query to insert data into the Posts table
        const { data, error } = await supabase
            .from('posts')
            .insert([{ 
                userid: userId, 
                title, 
                description, 
                imageurl: imageUrl,
                createdat: currentDateLocal, // Include current local timestamp for createdat field
                updatedat: currentDateLocal // Include current local timestamp for updatedat field
            }]);
        
        return { data, error };
    } catch (error) {
        console.error('Error inserting data:', error.message);
        return { error };
    }
};


// export const getPosts = async (sortBy = 'latest') => {
//   try {
//       let query = supabase.from('posts').select(`
//           id, 
//           title, 
//           description, 
//           likes, 
//           dislikes, 
//           createdat, 
//           updatedat, 
//           imageurl,
//           users( id, first_name, last_name)
//       `);

//       if (sortBy === 'latest') {
//           query = query.order('createdat', { ascending: false });
//       } else if (sortBy === 'oldest') {
//           query = query.order('createdat', { ascending: true });
//       }

//       const { data, error } = await query;
//       return { data, error };
//   } catch (error) {
//       console.error('Error fetching posts:', error.message);
//       return { error };
//   }
// };

export const editPost = async (postId, userId, newTitle, newDescription) => {
    try {
        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .eq('userid', userId)
            .single();
        
        if (error) {
            console.error('Error fetching post:', error.message);
            return { error };
        }

        if (!post) {
            console.error('Post not found or user is not authorized to edit.');
            return { error: 'Post not found or user is not authorized to edit.' };
        }

        // Update the post with new title and description
        const { data: updatedPost, updateError } = await supabase
            .from('posts')
            .update({ title: newTitle, description: newDescription })
            .eq('id', postId)
            .eq('userid', userId)
            .single();

        if (updateError) {
            console.error('Error updating post:', updateError.message);
            return { error: updateError.message };
        }

        return { data: updatedPost };
    } catch (error) {
        console.error('Error editing post:', error.message);
        return { error: error.message };
    }
};

export const deletePost = async (postId, userId) => {
    try {
        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .eq('userid', userId)
            .single();

        if (error) {
            console.error('Error fetching post:', error.message);
            return { error };
        }

        if (!post) {
            console.error('Post not found or user is not authorized to delete.');
            return { error: 'Post not found or user is not authorized to delete.' };
        }

        // Delete the post
        const { data: deletedPost, deleteError } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('userid', userId);

        if (deleteError) {
            console.error('Error deleting post:', deleteError.message);
            return { error: deleteError.message };
        }

        return { data: deletedPost };
    } catch (error) {
        console.error('Error deleting post:', error.message);
        return { error: error.message };
    }
};

export const incrementLikes = async (postId) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ likes: supabase.sql('likes + 1') })
        .eq('id', postId);
        
      return { data, error };
    } catch (error) {
      console.error('Error incrementing likes:', error.message);
      return { error };
    }
  };
  
  export const decrementLikes = async (postId) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ likes: supabase.sql('likes - 1') })
        .eq('id', postId);
        
      return { data, error };
    } catch (error) {
      console.error('Error decrementing likes:', error.message);
      return { error };
    }
  };
  
  export const incrementDislikes = async (postId) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ dislikes: supabase.sql('dislikes + 1') })
        .eq('id', postId);
        
      return { data, error };
    } catch (error) {
      console.error('Error incrementing dislikes:', error.message);
      return { error };
    }
  };
  
  export const decrementDislikes = async (postId) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ dislikes: supabase.sql('dislikes - 1') })
        .eq('id', postId);
        
      return { data, error };
    } catch (error) {
      console.error('Error decrementing dislikes:', error.message);
      return { error };
    }
  };

  export const addComment = async (postId, userId, comment) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ postid: postId, userid: userId, comment }]);
        return { data, error };
    } catch (error) {
        console.error('Error adding comment:', error.message);
        return { error };
    }
};

export const getComments = async (postId) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('id, userid, comment, createdat, users (first_name)')
            .eq('postid', postId);
        return { data, error };
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        return { error };
    }
};


export const getVotes = async (postId, userId) => {
    try {
        const { data, error } = await supabase
            .from('user_votes')
            .select('vote_type')
            .eq('postid', postId)
            .eq('userid', userId)
            .single();
        return { data, error };
    } catch (error) {
        console.error('Error fetching votes:', error.message);
        return { error };
    }
};



export const addVote = async (postId, userId, voteType) => {
  try {
      // Fetch the existing vote
      const { data: existingVote, error: existingVoteError } = await supabase
          .from('user_votes')
          .select('*')
          .eq('postid', postId)
          .eq('userid', userId)
          .single();

      if (existingVoteError && existingVoteError.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('Error fetching existing vote:', existingVoteError.message);
          return { error: existingVoteError };
      }

      let data, error;
      if (existingVote) {
          // If the user has already voted, update the vote
          if (existingVote.vote_type === voteType) {
              return { data: existingVote }; // No change if the vote type is the same
          }

          const incrementColumn = voteType === 'upvote' ? 'likes' : 'dislikes';
          const decrementColumn = voteType === 'upvote' ? 'dislikes' : 'likes';

          ({ data, error } = await supabase
              .from('user_votes')
              .update({ vote_type: voteType })
              .eq('postid', postId)
              .eq('userid', userId)
              .single());

          if (!error) {
              await supabase
                  .from('posts')
                  .update({
                      [incrementColumn]: supabase.sql(`${incrementColumn} + 1`),
                      [decrementColumn]: supabase.sql(`${decrementColumn} - 1`)
                  })
                  .eq('id', postId);
          }
      } else {
          // If the user has not voted, insert a new vote
          ({ data, error } = await supabase
              .from('user_votes')
              .insert({ postid: postId, userid: userId, vote_type: voteType }));

          const incrementColumn = voteType === 'upvote' ? 'likes' : 'dislikes';
          if (!error) {
              await supabase
                  .from('posts')
                  .update({ [incrementColumn]: supabase.sql(`${incrementColumn} + 1`) })
                  .eq('id', postId);
          }
      }

      return { data, error };
  } catch (error) {
      console.error('Error adding vote:', error.message);
      return { error };
  }
};
export const getPosts = async (sortBy = 'latest') => {
  try {
      let query = supabase.from('posts').select(`
          id, 
          title, 
          description, 
          likes, 
          dislikes, 
          createdat, 
          updatedat, 
          imageurl,
          users( id, first_name, last_name)
      `);

      if (sortBy === 'latest') {
          query = query.order('createdat', { ascending: false });
      } else if (sortBy === 'oldest') {
          query = query.order('createdat', { ascending: true });
      }

      const { data, error } = await query;
      return { data, error };
  } catch (error) {
      console.error('Error fetching posts:', error.message);
      return { error };
  }
};

export const getPostVotes = async (postId) => {
  try {
      const { data, error } = await supabase
          .from('posts')
          .select('likes, dislikes')
          .eq('id', postId)
          .single();
      return { data, error };
  } catch (error) {
      console.error('Error fetching votes:', error.message);
      return { error };
  }
};

export const getUserVote = async (postId, userId) => {
  try {
      const { data, error } = await supabase
          .from('user_votes')
          .select('vote_type')
          .eq('postid', postId)
          .eq('userid', userId)
          .single();
      return { data, error };
  } catch (error) {
      console.error('Error fetching user vote:', error.message);
      return { error };
  }
};

export const addOrUpdateVote = async (postId, userId, voteType) => {
  try {
      const { data: existingVote, error: existingVoteError } = await supabase
          .from('user_votes')
          .select('*')
          .eq('postid', postId)
          .eq('userid', userId)
          .single();

      if (existingVoteError && existingVoteError.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('Error fetching existing vote:', existingVoteError.message);
          return { error: existingVoteError };
      }

      let data, error;
      if (existingVote) {
          if (existingVote.vote_type === voteType) {
              return { data: existingVote }; // No change if the vote type is the same
          }

          const incrementColumn = voteType === 'upvote' ? 'likes' : 'dislikes';
          const decrementColumn = voteType === 'upvote' ? 'dislikes' : 'likes';

          ({ data, error } = await supabase
              .from('user_votes')
              .update({ vote_type: voteType })
              .eq('postid', postId)
              .eq('userid', userId)
              .single());

          if (!error) {
              await supabase
                  .from('posts')
                  .update({
                      [incrementColumn]: supabase.sql(`${incrementColumn} + 1`),
                      [decrementColumn]: supabase.sql(`${decrementColumn} - 1`)
                  })
                  .eq('id', postId);
          }
      } else {
          ({ data, error } = await supabase
              .from('user_votes')
              .insert({ postid: postId, userid: userId, vote_type: voteType }));

          const incrementColumn = voteType === 'upvote' ? 'likes' : 'dislikes';
          if (!error) {
              await supabase
                  .from('posts')
                  .update({ [incrementColumn]: supabase.sql(`${incrementColumn} + 1`) })
                  .eq('id', postId);
          }
      }

      return { data, error };
  } catch (error) {
      console.error('Error adding vote:', error.message);
      return { error };
  }
};

export default {
    signup,
    validatePassword,
    checkUserExists,
    resetPassword,
    addPost,
    getPosts,
    editPost,
    deletePost,
    decrementLikes,
    incrementDislikes,
    decrementDislikes,
    incrementLikes,
    addComment,
    getComments,
    addVote,
    getVotes,
    getUserVote,
    getPostVotes,
    addOrUpdateVote

};
