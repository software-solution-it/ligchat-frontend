import React, { useState, useEffect } from 'react';
import {
    Layout,
    Menu,
    Avatar,
    Dropdown,
    Button,
    Drawer,
    Select,
    message,
    Spin
} from 'antd';
import {
    DashboardOutlined,
    MessageOutlined,
    CalendarOutlined,
    TagsOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import DashBoard from '../screens/DashBoard';
import ChatPage from '../screens/ChatScreen';
import MessageSchedule from '../screens/MessageSchedule';
import LabelPage from '../screens/LabelScreen';
import CRMPage from '../screens/CRMPage';
import AccessPage from '../screens/AccessPage';
import SectorsPage from '../screens/SectorsPage';
import WebhookPage from '../screens/WebhookPage';
import ProfilePage from '../screens/ProfilePage';
import FlowPage from '../screens/FlowPage';
import VariablesPage from '../screens/VariablesPage';
import SessionService from '../services/SessionService';
import { getUser } from '../services/UserService';
import { getSectors, Sector } from '../services/SectorService';
import EditFlowPage from '../screens/EditFlowPage';
import { useMenu } from '../contexts/MenuContext';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const CombinedMenu: React.FC = () => {
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<JSX.Element | null>(<DashBoard />);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [isEditingFlow, setIsEditingFlow] = useState(false);
    const [selectedMenuKey, setSelectedMenuKey] = useState<string>('1');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const { drawerVisible, setDrawerVisible, drawerType, setDrawerType } = useMenu();

    useEffect(() => {
        const storedMenuKey = localStorage.getItem('selectedMenuKey');
        if (storedMenuKey) {
            setSelectedMenuKey(storedMenuKey);
            navigate(getPathFromKey(storedMenuKey));
        } else {
            navigate('/dashboard');
        }
    }, [navigate]);

    useEffect(() => {
        const tokenFromSession = SessionService.getSession('authToken');
        if (tokenFromSession) {
            fetchSectors(tokenFromSession);
        }
    }, [navigate]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchSectors = async (token: string) => {
        try {
            const response: any = await getSectors(token);
            setSectors(Array.isArray(response.data) ? response.data : []);
            const sectorId = SessionService.getSession('selectedSector');
            if (sectorId) {
                setSelectedSector(sectorId);
            }
        } catch (error) {
            console.error('Erro ao buscar setores:', error);
            setSectors([]);
        }
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/flow/edit/')) {
            setSelectedComponent(<EditFlowPage flowId={id} />);
            setIsEditingFlow(true);
        } else if (!isEditingFlow) {
            switch (path) {
                case '/dashboard':
                    setSelectedComponent(<DashBoard />);
                    break;
                case '/chat':
                    setSelectedComponent(<ChatPage />);
                    break;
                case '/message/schedule':
                    setSelectedComponent(<MessageSchedule />);
                    break;
                case '/flow':
                    setSelectedComponent(<FlowPage />);
                    break;
                case '/flow/variable':
                    setSelectedComponent(<VariablesPage />);
                    break;
                case '/crm':
                    setSelectedComponent(<CRMPage />);
                    break;
                case '/labels':
                    setSelectedComponent(<LabelPage />);
                    break;
                case '/profile':
                    setSelectedComponent(<ProfilePage />);
                    break;
                case '/access':
                    setSelectedComponent(<AccessPage />);
                    break;
                case '/sector':
                    setSelectedComponent(<SectorsPage />);
                    break;
                case '/webhook':
                    setSelectedComponent(<WebhookPage />);
                    break;
                default:
                    setSelectedComponent(<DashBoard />);
                    break;
            }
        }
    }, [location.pathname, isEditingFlow, id]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = SessionService.getSession('authToken');
                const decodedToken = token ? SessionService.decodeToken(token) : null;
                const userId = decodedToken ? decodedToken.userId : null;

                if (!userId) {
                    return;
                }

                const response: any = await getUser(userId);
                const userData = response.data;
                setName(userData.name);
                setAvatar(userData.avatarUrl || null);
                setIsAdmin(userData.isAdmin);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleSectorChange = (value: string) => {
        setIsLoading(true);
        setSelectedSector(value);
        SessionService.setSession('selectedSector', value);

        setTimeout(() => {
            setIsLoading(false);
        }, 0);
    };

    const handleLogout = () => {
        SessionService.clearSession();
        message.success('Sessão encerrada com sucesso.');
        navigate('/');
    };

    const handleMenuClick = (menuKey: string) => {
        setSelectedMenuKey(menuKey);
        localStorage.setItem('selectedMenuKey', menuKey);
        switch (menuKey) {
            case '1':
                setSelectedComponent(<DashBoard />);
                navigate('/dashboard');
                break;
            case '2':
                setSelectedComponent(<ChatPage />);
                navigate('/chat');
                break;
            case '3':
                setSelectedComponent(<MessageSchedule />);
                navigate('/message/schedule');
                break;
            case '4-1':
                setSelectedComponent(<FlowPage />);
                navigate('/flow');
                break;
            case '4-2':
                setSelectedComponent(<VariablesPage />);
                navigate('/flow/variable');
                break;
            case '5':
                setSelectedComponent(<CRMPage />);
                navigate('/crm');
                break;
            case '6':
                setSelectedComponent(<LabelPage />);
                navigate('/labels');
                break;
            case '7':
                setSelectedComponent(<ProfilePage />);
                navigate('/profile');
                break;
            case '8-1':
                setSelectedComponent(<AccessPage />);
                navigate('/access');
                break;
            case '8-2':
                setSelectedComponent(<SectorsPage />);
                navigate('/sector');
                break;
            case '8-3':
                setSelectedComponent(<WebhookPage />);
                navigate('/webhook');
                break;
            case '9':
                handleLogout();
                break;
            default:
                setSelectedComponent(<DashBoard />);
                navigate('/dashboard');
        }
    };

    const getPathFromKey = (key: string) => {
        switch (key) {
            case '1': return '/dashboard';
            case '2': return '/chat';
            case '3': return '/message/schedule';
            case '4-1': return '/flow';
            case '4-2': return '/flow/variable';
            case '5': return '/crm';
            case '6': return '/labels';
            case '7': return '/profile';
            case '8-1': return '/access';
            case '8-2': return '/sector';
            case '8-3': return '/webhook';
            default: return '/dashboard';
        }
    };

    const menuItems = [
        { key: '1', icon: <DashboardOutlined />, label: 'DashBoard' },
        { key: '2', icon: <MessageOutlined />, label: 'Chat ao vivo' },
        { key: '3', icon: <MessageOutlined />, label: 'Agendamento de Mensagens' },
        {
            key: '4',
            icon: <CalendarOutlined />,
            label: 'Flow',
            children: [
                { key: '4-1', label: 'Flow' },
                { key: '4-2', label: 'Variáveis' },
            ],
        },
        { key: '5', icon: <TagsOutlined />, label: 'CRM' },
        { key: '6', icon: <TagsOutlined />, label: 'Etiqueta' },
        { key: '7', icon: <UserOutlined />, label: 'Perfil' },
        ...(isAdmin ? [
            {
                key: '8',
                icon: <SettingOutlined />,
                label: 'Configurações',
                children: [
                    { key: '8-1', label: 'Acessos' },
                    { key: '8-2', label: 'Gerenciar Setores' },
                    { key: '8-3', label: 'Webhook' },
                ],
            }
        ] : []),
        { key: '9', icon: <LogoutOutlined />, label: 'Sair' },
    ];

    const dropdownMenuItems = [
        { key: '10', label: 'Perfil', icon: <UserOutlined /> },
        { key: '11', label: 'Editar Fluxo' },
    ];

    const dropdownMenu = { items: dropdownMenuItems };

    const showDrawer = () => {
        setDrawerType('menu');
        setDrawerVisible(true);
    };

    const onClose = () => {
        setDrawerVisible(false);
        setDrawerType(null);
    };

    return (
        <Layout>
            <Header
                className="site-layout-background"
                style={{
                    padding: '0 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                        <Button
                            type="text"
                            onClick={showDrawer}
                            icon={<MenuOutlined />}
                            style={{ fontSize: '20px', marginRight: '16px' }}
                            className="menu-button"
                        />
                    )}
                    <img src={Logo} alt="LigChat Logo" style={{ maxWidth: '40px', maxHeight: '40px' }} />
                </div>
                <Dropdown menu={dropdownMenu}>
                    <div className="flex items-center cursor-pointer">
                        {isLoading ? (
                            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
                        ) : (
                            <Avatar
                                size={40}
                                icon={!avatar ? <UserOutlined /> : undefined}
                                src={avatar ? avatar : undefined}
                            />
                        )}
                        <span className="ml-2 text-black">
                            {isLoading ? (
                                <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                            ) : (
                                name
                            )}
                        </span>
                    </div>
                </Dropdown>
            </Header>

            <Layout>
                {!isMobile && (
                    <Sider
                        width={300}
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(collapsed) => setCollapsed(collapsed)}
                        breakpoint="lg"
                        collapsedWidth="0"
                        className="site-layout-background menu-sider"
                        style={{
                            height: '85vh',
                            backgroundColor: '#1f1f1f',
                            borderRadius: '20px',
                            padding: '20px',
                            margin: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        {isLoading ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%'
                            }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <>
                                <Menu
                                    theme="dark"
                                    mode="inline"
                                    selectedKeys={[selectedMenuKey]}
                                    onClick={({ key }) => handleMenuClick(key)}
                                    items={menuItems}
                                    style={{ backgroundColor: '#1f1f1f', borderRadius: '10px' }}
                                />
                                <div style={{ marginTop: '20px' }}>
                                    <Select
                                        value={selectedSector || null}
                                        style={{ width: '100%' }}
                                        placeholder="Selecione o setor"
                                        onChange={handleSectorChange}
                                    >
                                        <Option value={null}>Selecione o setor</Option>
                                        {sectors.map((sector) => (
                                            <Option key={sector.id} value={sector.id}>
                                                {sector.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </>
                        )}
                    </Sider>
                )}

                {isMobile && drawerType === 'menu' && (
                    <Drawer
                        title={null}
                        placement="left"
                        onClose={onClose}
                        open={drawerVisible}
                        bodyStyle={{ 
                            padding: '0',
                            height: '100vh',
                            overflow: 'auto',
                            backgroundColor: '#fff'
                        }}
                        width="100%"
                        height="100vh"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '100vh'
                        }}
                        contentWrapperStyle={{
                            backgroundColor: '#fff'
                        }}
                        mask={false}
                        maskClosable={false}
                        closeIcon={<MenuOutlined style={{ color: '#000', fontSize: '20px' }} />}
                    >
                        <Layout style={{ 
                            height: '100vh',
                            backgroundColor: '#fff'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%',
                                backgroundColor: '#fff',
                                padding: '0 16px'
                            }}>
                                <div style={{
                                    padding: '16px 0',
                                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                                }}>
                                    <Select
                                        value={selectedSector}
                                        style={{ width: '100%' }}
                                        placeholder="Selecione o setor"
                                        onChange={handleSectorChange}
                                    >
                                        <Option value={null}>Selecione o setor</Option>
                                        {sectors.map((sector) => (
                                            <Option key={sector.id} value={sector.id}>
                                                {sector.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                <Menu
                                    theme="light"
                                    mode="inline"
                                    selectedKeys={[selectedMenuKey]}
                                    items={menuItems}
                                    style={{ 
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        flex: 1,
                                        padding: '16px 0'
                                    }}
                                    className="mobile-menu"
                                    onClick={({ key }) => {
                                        handleMenuClick(key);
                                        onClose();
                                    }}
                                />
                            </div>
                        </Layout>
                    </Drawer>
                )}

                <Layout style={{ padding: '24px' }}>
                    <Content>
                        {isLoading ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%'
                            }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            selectedComponent
                        )}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default CombinedMenu;
