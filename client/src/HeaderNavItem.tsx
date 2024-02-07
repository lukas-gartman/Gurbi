import './Header.css';

function HeaderNavItem(props: { url: string, active?: boolean, children: React.ReactNode}) {
    return (
        <a className={"nav-button" + (props.active ? " active" : "")} href={props.url}>{props.children}</a>
    );
}

export default HeaderNavItem;