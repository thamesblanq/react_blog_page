import { createContext, useEffect, useState } from "react";
import useWindowSize from '../hooks/useWindowSize';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);//post' array from db
    const [search, setSearch] = useState('');//searchBar's state
    const [searchResults, setSearchResults] = useState([]);// array of posts that contains user's search history 
    const { width } = useWindowSize();
    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');
  
    //R- read from db
    useEffect(() => {
      setPosts(data);
    }, [data])
  
    //search posts
    useEffect(() => {
      const filteredResults = posts.filter(post => ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase())
      );//checking if the post's body or the post's title includes the search's value
      setSearchResults(filteredResults.reverse());
    }, [search, posts]);

    return (
        <DataContext.Provider value={{
            width, search, setSearch, 
            isLoading, fetchError, searchResults,
            posts, setPosts
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;