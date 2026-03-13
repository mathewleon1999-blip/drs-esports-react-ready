import { Link } from "react-router-dom";
import Meta from "../components/Meta";

export default function NotFound() {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Meta
        title="Page Not Found | DRS ESPORTS"
        description="The page you’re looking for doesn’t exist."
        canonicalPath="/404"
        noIndex
      />

      <h1>404 - Page Not Found</h1>
      <p>The page you’re looking for doesn’t exist or has been moved.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}
