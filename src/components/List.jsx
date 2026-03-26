import { Link } from 'react-router-dom';
import logo from '@imgs/logo.png';

const List = ({ list }) => {
  // Kiểm tra nếu list.image tồn tại và không rỗng, nếu không thì dùng logo
  const imageSrc = list.image && list.image.trim() ? list.image : logo;

  return (
    <Link
      to={`/list/${list.id}`}
      className="block w-full bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-48">
        <img
          src={imageSrc}
          alt={list.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 bg-opacity-0 hover:bg-opacity-20 transition duration-300" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{list.name}</h3>
        <p className="text-sm text-gray-500">{list.items} items</p>
      </div>
    </Link>
  );
};

export default List;