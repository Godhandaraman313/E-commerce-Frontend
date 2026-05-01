import { Link } from "react-router-dom";

export default function Breadcrumb({ categories = [], product }) {
  if (!categories.length && !product) return null;

  return (
    <div className="row">
      <div className="col">
        <nav>
          <ol className="breadcrumb">

            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>

            {categories.map((parent) => (
              <li key={parent.id} className="breadcrumb-item">
                <Link to={`/c/${parent.alias}`}>
                  {parent.name}
                </Link>
              </li>
            ))}

            {product && (
              <li className="breadcrumb-item active">
                {product.shortName}
              </li>
            )}

          </ol>
        </nav>
      </div>
    </div>
  );
}