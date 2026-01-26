import Sidebar from "./Sidebar.jsx";

function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <div className="ml-20">{children}</div>
    </>
  );
}

export default Layout;
