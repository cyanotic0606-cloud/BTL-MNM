import Link from 'next/link';
import { IoMailOutline } from 'react-icons/io5';
import { PiFacebookLogo, PiInstagramLogo, PiPhone, PiYoutubeLogo } from 'react-icons/pi';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8 bg-[url('/images/footer.png')] bg-bottom-left bg-repeat-x">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
          {/* Thông tin cửa hàng */}
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-lg text-gray-900">Thông tin cửa hàng</h4>
            <div className="flex flex-col gap-3">
              <Link
                href="https://www.youtube.com/@tructiepgame-official"
                className="flex items-center text-gray-600 hover:text-gray-900 gap-3 transition-colors group"
              >
                <PiYoutubeLogo className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Kênh Youtube</span>
              </Link>
              <Link
                href="tel:0962920948"
                className="flex items-center text-gray-600 hover:text-gray-900 gap-3 transition-colors group"
              >
                <PiPhone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>0962920948</span>
              </Link>
              <Link
                href="mailto:hoanganhan04@gmail.com"
                className="flex items-center text-gray-600 hover:text-gray-900 gap-3 transition-colors group"
              >
                <IoMailOutline className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>hoanganhan04@gmail.com</span>
              </Link>
            </div>
          </div>

          {/* Mạng xã hội */}
          <div className="flex flex-col gap-5 md:items-center">
            <h4 className="font-bold text-lg text-gray-900">Mạng xã hội</h4>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.youtube.com/@tructiepgame-official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <PiYoutubeLogo className="w-8 h-8 hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://www.facebook.com/anhoanganh1872004"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <PiFacebookLogo className="w-8 h-8 hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://www.instagram.com/cter_bob_145/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <PiInstagramLogo className="w-8 h-8 hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="flex flex-col gap-5 lg:items-end">
            <h4 className="font-bold text-lg text-gray-900">Hỗ trợ khách hàng</h4>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                href="/chinh-sach-doi-tra"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Chính sách đổi trả
              </Link>
              <Link
                href="/chinh-sach-bao-mat"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/huong-dan-thanh-toan"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Hướng dẫn thanh toán
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ThapCamStore
          </p>
        </div>
      </div>
    </footer>
  );
}
