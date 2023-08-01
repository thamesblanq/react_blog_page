import Layout from './Layout';
import PostPage from './PostPage';
import Home from './Home';
import NewPost from './NewPost';
import About from './About';
import Missing from './Missing';
import EditPost from './EditPost';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import useAxiosFetch from './hooks/useAxiosFetch';
import { useStoreActions } from 'easy-peasy';
//import { DataProvider } from './context/DataContext';


function App() {
  const setPosts = useStoreActions((actions) => actions.setPosts)
  const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');
  
  //R- read from db
  useEffect(() => {
    setPosts(data);
  }, [data, setPosts])
  
  //R- read from db
/*   useEffect(() => {
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
  }, []); */


  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home 
          isLoading={isLoading}
          fetchError={fetchError} />}
        />
        <Route path="post">
          <Route index element={<NewPost />} />
          <Route path=":id" element={<PostPage />} />
        </Route>
        <Route path="edit/:id" element={<EditPost />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}


export default App
