import { useContext, useState } from 'react';
import DataContext from './context/DataContext';
import { useNavigate } from 'react-router-dom';
import api from './api/posts';
import { format } from 'date-fns';

const NewPost = () => {
  const [postTitle, setPostTitle] = useState('');//post's title state
  const [postBody, setPostBody] = useState('');//post's body state

  const { posts, setPosts } = useContext(DataContext);
  const navigate = useNavigate();

  //creating a new post/blog post-- C- create
  const handleSubmit = async (e) => {
    e.preventDefault();//preventing the page refresh
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp'); 
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post('/posts', newPost)
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    } catch(err) {
      console.log(`Error: ${err.message}`);
    }
  }

  return (
    <main className="NewPost">
        <h2>New Post</h2>
        <form className="newPostForm" onSubmit={handleSubmit}>
          <label htmlFor="postTitle">Title</label>
          <input 
            id="postTitle"
            type="text"
            required
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <label htmlFor="postBody">Post:</label>
          <textarea
            id="postBody"
            required
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
          >
          </textarea>
          <button type="submit" onClick={handleSubmit}>Submit</button>
        </form>
    </main>
  )
}

export default NewPost