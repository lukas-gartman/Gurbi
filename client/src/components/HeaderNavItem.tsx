import { Link } from 'react-router-dom';
import '../stylesheets/Header.css';

function HeaderNavItem(props: { url: string, active?: boolean, children: React.ReactNode}) {
    return (
        <Link className={"nav-button" + (props.active ? " active" : "")} to={props.url}>{props.children}</Link>
    );
}

export default HeaderNavItem;