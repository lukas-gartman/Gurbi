import React, { HTMLProps, useContext, useEffect, useState } from 'react';
import {useLocation} from 'react-router';
import '../stylesheets/Header.css';
import { Link } from 'react-router-dom';
import { ClientContext, UserContext } from '../App';
import { IUser } from '../models/models';

interface Header {
	onSearch?: (searchResults: JSON) => void,
	headerContent?: React.ReactNode,
	headerNav?: React.ReactNode;
}

function Header({ onSearch, headerContent, headerNav }: Header) {
	const client = useContext(ClientContext);
	const [user, setUser] = useState<IUser>();
	useEffect(() => {
		const loadUser = async () => {
			setUser((await client.get("/user/authorized/me")).data);
		}
		loadUser();
	}, []);

	const curr: string = useLocation().pathname.split("/")[1];
	function defaultOnSearch(content: JSON): void {
		console.log(content);
	}

	const defaultHeaderContent = (
		<>
		<h1>Gurbi</h1>
		<div className="search-bar">
			<span><i className="bi bi-search"></i></span>
			<input id="search-bar" type="text" placeholder={"Search " + curr} onKeyUp={onSearchChange} />
			<span id="clear-search" onClick={clearText}><i className="bi bi-x-circle"></i></span>
		</div>
		<Link to="/profile"><img className="profile-image" src={user && (client.defaults.baseURL + user.picture)}></img></Link>
		</>
	);

	function onSearchChange(): void {
		const clearSearch = document.getElementById("clear-search") as HTMLSpanElement;
		const x = document.getElementById("search-bar") as HTMLInputElement;
		if (x.value) {
			clearSearch.style.visibility = "visible";

			client.get<JSON>("/" + curr + "/search?q=" + x.value)
			.then(response => onSearch?.(response.data) || defaultOnSearch(response.data))
			.catch(error => onSearch?.(error) || defaultOnSearch(error));
		} else {
			clearSearch.style.visibility = "hidden";
		}
	}

	function clearText(): void {
		const clearSearch = document.getElementById("clear-search") as HTMLSpanElement;
		const searchBar = document.getElementById("search-bar") as HTMLInputElement;
		searchBar.value = "";
		clearSearch.style.visibility = "hidden";
		searchBar.dispatchEvent(new Event("input"));
	}

	return (
		<header>
			<div className="header-row">
				{ headerContent || defaultHeaderContent }
			</div>
			{ headerNav &&
				<nav className="header-row">
					{ headerNav }
				</nav>
			}
		</header>
	);
}

export default Header;