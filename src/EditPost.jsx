import { useEffect, useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DataContext from './context/DataContext';
import { format } from 'date-fns';
import api from './api/posts';

const EditPost = () => {
    const { posts, setPosts } = useContext(DataContext);
    const { id } = useParams();//getting the id from the url
    const post = posts.find(post => (post.id).toString() === id);//checking for the post with same id
    const [editBody, setEditBody] = useState('');// edit post body state
    const [editTitle, setEditTitle] = useState('');//edit post's title state
    const navigate = useNavigate();

    useEffect(() => {
        if(post) {
            setEditTitle(post.title);
            setEditBody(post.body)
        }
    }, [post, setEditTitle, setEditBody])

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

  return (
    <main className="NewPost">
        {editTitle && 
            <>
                <h2> Edit Post</h2>
                <form className="newPostForm" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="postTitle">Title:</label>
                <input 
                    id="postTitle"
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                />
                <label htmlFor="postBody">Post:</label>
                <textarea
                    id="postBody"
                    required
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                >
                </textarea>
                <button type="submit" onClick={() => handleEdit(post.id)}>Submit</button>
                </form>
            </>
        } 
        {!editTitle && 
            <>
                <h2>Post Not Found</h2>
                <p>Well, that is disappointing. </p>
                <p>
                    <Link to='/'>Visit Our Homepage</Link>
                </p>
            </>

        }
    </main>
  )
}

export default EditPost