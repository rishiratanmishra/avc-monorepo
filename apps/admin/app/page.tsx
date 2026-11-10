"use client";

import {
  CalendarOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HeartOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Input,
  Layout,
  Menu,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import styles from "./page.module.css";

const { Content, Header, Sider } = Layout;
const { Paragraph, Text, Title } = Typography;

type Appointment = {
  key: string;
  time: string;
  pet: string;
  owner: string;
  service: string;
  veterinarian: string;
  status: "Checked in" | "Confirmed" | "Waiting";
};

const appointments: Appointment[] = [
  {
    key: "1",
    time: "09:30 AM",
    pet: "Bruno",
    owner: "Aarav Sharma",
    service: "Routine check-up",
    veterinarian: "Dr. Mehta",
    status: "Checked in",
  },
  {
    key: "2",
    time: "10:15 AM",
    pet: "Misty",
    owner: "Priya Kapoor",
    service: "Vaccination",
    veterinarian: "Dr. Rao",
    status: "Confirmed",
  },
  {
    key: "3",
    time: "11:00 AM",
    pet: "Coco",
    owner: "Kabir Singh",
    service: "Dental consultation",
    veterinarian: "Dr. Mehta",
    status: "Waiting",
  },
  {
    key: "4",
    time: "11:45 AM",
    pet: "Milo",
    owner: "Ananya Verma",
    service: "Follow-up visit",
    veterinarian: "Dr. Iyer",
    status: "Confirmed",
  },
];

const columns: TableProps<Appointment>["columns"] = [
  {
    title: "TIME",
    dataIndex: "time",
    key: "time",
    width: 120,
    render: (time: string) => <Text strong>{time}</Text>,
  },
  {
    title: "PET & OWNER",
    key: "pet",
    render: (_value, appointment) => (
      <Space orientation="vertical" size={0}>
        <Text strong>{appointment.pet}</Text>
        <Text type="secondary">{appointment.owner}</Text>
      </Space>
    ),
  },
  {
    title: "SERVICE",
    dataIndex: "service",
    key: "service",
  },
  {
    title: "VETERINARIAN",
    dataIndex: "veterinarian",
    key: "veterinarian",
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    render: (status: Appointment["status"]) => {
      const color =
        status === "Checked in"
          ? "green"
          : status === "Waiting"
            ? "orange"
            : "blue";

      return <Tag color={color}>{status}</Tag>;
    },
  },
];

const menuItems = [
  { key: "overview", icon: <DashboardOutlined />, label: "Overview" },
  { key: "appointments", icon: <CalendarOutlined />, label: "Appointments" },
  { key: "patients", icon: <HeartOutlined />, label: "Patients" },
  { key: "clients", icon: <UserOutlined />, label: "Clients" },
  { key: "records", icon: <FileTextOutlined />, label: "Medical records" },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
];

export default function AdminDashboard() {
  return (
    <Layout className={styles.dashboard}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className={styles.sidebar}
        width={248}
      >
        <div className={styles.brand}>
          <div className={styles.brandMark}>A</div>
          <div>
            <Text strong className={styles.brandName}>
              AVC Pet Hospital
            </Text>
            <Text className={styles.brandCaption}>STAFF PORTAL</Text>
          </div>
        </div>
        <Text className={styles.menuCaption}>WORKSPACE</Text>
        <Menu
          className={styles.menu}
          mode="inline"
          selectedKeys={["overview"]}
          items={menuItems}
        />
        <div className={styles.sidebarFooter}>
          <div className={styles.locationDot} />
          <div>
            <Text strong className={styles.locationName}>
              Sector 90 Centre
            </Text>
            <Text className={styles.locationCaption}>Gurugram, Haryana</Text>
          </div>
        </div>
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <div>
            <Text className={styles.breadcrumb}>AVC / Overview</Text>
          </div>
          <Space size={16}>
            <Input
              aria-label="Search dashboard"
              className={styles.search}
              placeholder="Search"
              prefix={<SearchOutlined />}
            />
            <Avatar className={styles.avatar}>RS</Avatar>
            <div className={styles.account}>
              <Text strong>Rishi Sharma</Text>
              <Text type="secondary">Administrator</Text>
            </div>
          </Space>
        </Header>

        <Content className={styles.content}>
          <div className={styles.pageHeading}>
            <div>
              <Text className={styles.dateLabel}>CENTRE OVERVIEW</Text>
              <Title level={2} className={styles.title}>
                Good morning, Rishi
              </Title>
              <Paragraph className={styles.subtitle}>
                Here&apos;s what&apos;s happening at your centre today.
              </Paragraph>
            </div>
            <Button type="primary" icon={<PlusOutlined />}>
              New appointment
            </Button>
          </div>

          <Row gutter={[16, 16]} className={styles.stats}>
            <Col xs={24} sm={12} xl={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="Appointments today"
                  value={24}
                  suffix={<CalendarOutlined className={styles.statIcon} />}
                />
                <Text className={styles.statHint}>6 more than yesterday</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="Checked in"
                  value={8}
                  suffix={<ClockCircleOutlined className={styles.statIcon} />}
                />
                <Text className={styles.statHint}>2 currently waiting</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="Active patients"
                  value={1286}
                  suffix={<HeartOutlined className={styles.statIcon} />}
                />
                <Text className={styles.statHint}>Across this centre</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <Card className={styles.statCard}>
                <Statistic
                  title="Needs follow-up"
                  value={12}
                  suffix={<FileTextOutlined className={styles.statIcon} />}
                />
                <Text className={styles.statHint}>
                  Review patient reminders
                </Text>
              </Card>
            </Col>
          </Row>

          <Card
            className={styles.appointmentsCard}
            title={
              <div className={styles.tableHeading}>
                <div>
                  <Title level={5}>Today&apos;s appointments</Title>
                  <Text type="secondary">Your centre&apos;s schedule</Text>
                </div>
                <Button type="link">View all</Button>
              </div>
            }
          >
            <Table<Appointment>
              columns={columns}
              dataSource={appointments}
              pagination={false}
              scroll={{ x: 760 }}
              size="middle"
            />
          </Card>
          <Text className={styles.previewNote}>
            UI preview only — sample data, not connected to the API.
          </Text>
        </Content>
      </Layout>
    </Layout>
  );
}
