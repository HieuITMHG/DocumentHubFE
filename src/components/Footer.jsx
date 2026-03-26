import React from 'react';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Thông tin cá nhân */}
        <div>
          <h2 className="text-xl font-bold mb-4">SlideMate</h2>
          <p className="text-sm text-gray-400">
            SlideMate – Nền tảng chia sẻ tài liệu hàng đầu. Dễ dàng tìm kiếm, tải lên và chia sẻ kiến thức với cộng đồng học tập rộng khắp.
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/" className="hover:underline">Trang chủ</a></li>
            <li><a href="/about" className="hover:underline">Giới thiệu</a></li>
            <li><a href="/contact" className="hover:underline">Liên hệ</a></li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Kết nối với tôi</h3>
          <div className="flex space-x-4 text-2xl">
            <a href="https://facebook.com/yourprofile" target="_blank" rel="noreferrer">
              <FaFacebook className="hover:text-blue-500 transition" />
            </a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noreferrer">
              <FaGithub className="hover:text-gray-400 transition" />
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer">
              <FaLinkedin className="hover:text-blue-400 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} slidemate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
