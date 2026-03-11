import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/features/userSlice";
import { Button, Input, Form, Typography, Card } from "antd";
import styles from "./Login.module.scss";

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  // ✅ Ant Design message hook

  const handleSubmit = (values) => {
    dispatch(loginUser(values));
  };

  return (
    <div className={styles.wrapper}>
      {/* ✅ message üçün context */}

      <Card className={styles.card}>
        <div className={styles.logoSection}>
          <img
            src="https://pbs.twimg.com/profile_images/1272846503971782657/Z6B7CiPk_400x400.jpg"
            alt="logo"
            className={styles.logo}
          />
          <Text className={styles.subtitle}>
            AZƏRBAYCAN RESPUBLİKASININ <br /> BAŞ PROKURORLUĞU
          </Text>
        </div>

        <Title level={2} className={styles.title}>
          Daxil ol
        </Title>
        <Text type="secondary" className={styles.desc}>
          Giriş etmək üçün aşağıdakı məlumatları daxil edin.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            label="FİN"
            name="pin"
            rules={[
              { required: true, message: "FİN tələb olunur" },
              { len: 7, message: "FİN 7 simvoldan ibarət olmalıdır" },
            ]}
          >
            <Input placeholder="FİN daxil edin" />
          </Form.Item>

          <Form.Item
            label="Şifrə"
            name="password"
            rules={[{ required: true, message: "Şifrə tələb olunur" }]}
          >
            <Input.Password placeholder="Şifrənizi daxil edin" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.loginBtn}
            >
              Daxil ol
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div className={styles.footer}>
        © 2025 Azərbaycan Respublikasının Baş Prokurorluğu. Müəllif hüquqları
        qorunur.
      </div>
    </div>
  );
};

export default Login;
