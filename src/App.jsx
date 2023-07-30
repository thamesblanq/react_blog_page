import Layout from './Layout';
import PostPage from './PostPage';
import Home from './Home';
import NewPost from './NewPost';
import About from './About';
import Missing from './Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from './api/posts';
import EditPost from './EditPost';


function App() {

  const [posts, setPosts] = useState([]);//post' array from db
  const [search, setSearch] = useState('');//searchBar's state
  const [searchResults, setSearchResults] = useState([]);// array of posts that contains user's search history
  const [postTitle, setPostTitle] = useState('');//post's title state
  const [postBody, setPostBody] = useState('');//post's body state
  const [editBody, setEditBody] = useState('');// edit post body state
  const [editTitle, setEditTitle] = useState('');//edit post's title state
  const navigate = useNavigate(); 

  //R- read from db
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        if (response && response.data) setPosts(response.data);
      } catch(err){
        if (err.response) {
          //Not in the 200 response range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    }

    fetchPosts();
  }, []);

  //search posts
  useEffect(() => {
    const filteredResults = posts.filter(post => ((post.body).toLowerCase()).includes(search.toLowerCase())
    || ((post.title).toLowerCase()).includes(search.toLowerCase())
    );//checking if the post's body or the post's title includes the search's value
    setSearchResults(filteredResults.reverse());
  }, [search, posts]);


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

  //U -- update
  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp'); 
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      const newPost = posts.map(post => post.id === id ? { ...response.data } : post);//if the post id is equal to the id then change the entire post body else leave the post be
      setPosts(newPost);
      setEditTitle('');
      setEditBody('');
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  //deleting a post by it's id -- D-delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList);
      navigate('/');
    } catch(err) {
      console.log(`Error: ${err.message}`);
    }
  }


  return (
    <Routes>
      <Route path="/" element={<Layout search={search} setSearch={setSearch} />}>
        <Route index element={<Home posts={searchResults} />} />
        <Route path="post">
          <Route index element={<NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />} 
          />
          <Route path=":id" element={<PostPage
              posts={posts}
              handleDelete={handleDelete}
          />} 
          />
        </Route>
        <Route path="edit/:id" element={<EditPost
            posts={posts}
            handleEdit={handleEdit}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editBody={editBody}
            setEditBody={setEditBody} />} 
        />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}


export default App
