import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, LogOut, FileText } from 'lucide-react';
import { useEffect } from 'react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Inventory', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
        { name: 'Orders', path: '/admin/orders', icon: <FileText className="w-5 h-5" /> },
        { name: 'Add Product', path: '/admin/products/new', icon: <PlusCircle className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
                <div className="h-20 flex items-center justify-center border-b border-gray-800">
                    <span className="font-bold text-2xl tracking-tight">
                        Divine<span className="text-primary-500">Admin</span>
                    </span>
                </div>
                
                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive 
                                    ? 'bg-primary-600 text-white font-medium shadow-md' 
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                    <div className="mt-4 text-xs text-center text-gray-600">
                        <Link to="/" className="hover:text-primary-400">View Live Store</Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white shadow-sm flex items-center px-8 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Dashboard'}
                    </h2>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
