import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

const Nav = () => {
  const posts = useStoreState((state) => state.posts);
  const search = useStoreState((state) => state.search);
  const setSearch = useStoreActions((actions) => actions.setSearch);
  const setSearchResults = useStoreActions((actions) => actions.setSearchResults);

  useEffect(() => {
    const filteredResults = posts.filter(post => ((post.body).toLowerCase()).includes(search.toLowerCase())
    || ((post.title).toLowerCase()).includes(search.toLowerCase())
    );//checking if the post's body or the post's title includes the search's value
    setSearchResults(filteredResults.reverse());
  }, [search, posts, setSearchResults]);

  return (
    <nav className="Nav">
        <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search">Search Posts</label>
          <input 
            type="text"
            id="search"
            placeholder="Search Posts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <ul>
          <li> <Link to="/">Home</Link></li>
          <li> <Link to="post">Post</Link></li>
          <li> <Link to="about">About</Link></li>
        </ul>
    </nav>
  )
}

export default Nav