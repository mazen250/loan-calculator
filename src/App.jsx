import { useState } from "react";
import { Button, Modal, Input, Form, message, ConfigProvider } from "antd";
import axios from "axios";
import "./index.css";
import { CiCalculator1 } from "react-icons/ci";
import { FaDollarSign } from "react-icons/fa";
import "./App.css";
import "antd/dist/reset.css";

function App() {
  const [isMaxLimitModalVisible, setIsMaxLimitModalVisible] = useState(false);
  const [isMonthlyPaymentModalVisible, setIsMonthlyPaymentModalVisible] =
    useState(false);
  const [maxLimit, setMaxLimit] = useState(null);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [form] = Form.useForm();

  const showMaxLimitModal = () => setIsMaxLimitModalVisible(true);
  const showMonthlyPaymentModal = () => setIsMonthlyPaymentModalVisible(true);

  const handleCancel = () => {
    setIsMaxLimitModalVisible(false);
    setIsMonthlyPaymentModalVisible(false);
    form.resetFields();
    setMaxLimit(null);
    setMonthlyPayment(null);
  };

  const onCalculateMaxLimit = (values) => {
    const { monthlyPayment, annualInterestRate, loanTermYears } = values;
    console.log(values);
    if (!monthlyPayment || !annualInterestRate || !loanTermYears) {
      message.error("Please fill all the fields!");
      return;
    }

    // Convert annual interest rate to a monthly rate
    const monthlyInterestRate = annualInterestRate / 100 / 12;

    // Convert loan term in years to months
    const nMonths = loanTermYears * 12;

    // Calculate the max loan amount using the loan amortization formula
    const maxLoanAmount =
      (monthlyPayment * (Math.pow(1 + monthlyInterestRate, nMonths) - 1)) /
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, nMonths));
    setMaxLimit(maxLoanAmount);
    // axios
    //   .post("http://localhost:3000/max-loan-amount", {
    //     monthlyPayment,
    //     annualInterestRate,
    //     loanTermYears,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     setMaxLimit(response.data.maxLoanAmount);
    //   })
    //   .catch((error) => {
    //     message.error("Error calculating max limit");
    //   });
  };

  const onCalculateMonthlyPayment = (values) => {
    const { loanAmount, annualInterestRate, loanTermYears } = values;
    if (!loanAmount || !annualInterestRate || !loanTermYears) {
      message.error("Please fill all the fields!");
      return;
    }

    // Convert annual interest rate to a monthly rate
    const monthlyInterestRate = annualInterestRate / 100 / 12;

    // Convert loan term in years to months
    const nMonths = loanTermYears * 12;

    // Calculate the monthly payment using the loan amortization formula
    const monthlyPayment =
      (loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, nMonths))) /
      (Math.pow(1 + monthlyInterestRate, nMonths) - 1);

    setMonthlyPayment(monthlyPayment);
    // axios
    //   .post("http://localhost:3000/monthly-payment", {
    //     loanAmount,
    //     annualInterestRate,
    //     loanTermYears,
    //   })
    //   .then((response) => {
    //     setMonthlyPayment(response.data.monthlyPayment);
    //   })
    //   .catch((error) => {
    //     message.error("Error calculating monthly payment");
    //   });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#01700a",
        },
      }}
    >
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 py-10">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Loan Calculator
            </h2>
            <div className="flex justify-center gap-4 flex-col md:flex-row">
              <Button
                type="primary"
                icon={<FaDollarSign />}
                onClick={showMaxLimitModal}
              >
                Calculate Max Limit
              </Button>
              <Button
                type="default"
                icon={<CiCalculator1 />}
                onClick={showMonthlyPaymentModal}
              >
                Calculate Monthly Payment
              </Button>
            </div>
          </div>
        </div>

        {/* Modal for Max Limit Calculation */}
        <Modal
          title="Calculate Max Limit"
          visible={isMaxLimitModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={onCalculateMaxLimit}>
            <Form.Item
              label="Monthly Payment (EGP)"
              name="monthlyPayment"
              rules={[
                {
                  required: true,
                  message: "Please enter your monthly payment!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Annual Interest Rate (%)"
              name="annualInterestRate"
              rules={[
                {
                  required: true,
                  message: "Please enter the annual interest rate!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Loan Term (Years)"
              name="loanTermYears"
              rules={[
                {
                  required: true,
                  message: "Please enter the loan term in years!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Calculate
            </Button>
          </Form>
          {maxLimit && (
            <div className="mt-4">
              <h3>
                Your Max Loan Limit: {new Intl.NumberFormat().format(maxLimit)}{" "}
                EGP
              </h3>
            </div>
          )}
        </Modal>

        {/* Modal for Monthly Payment Calculation */}
        <Modal
          title="Calculate Monthly Payment"
          visible={isMonthlyPaymentModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onCalculateMonthlyPayment}
          >
            <Form.Item
              label="Loan Amount (EGP)"
              name="loanAmount"
              rules={[
                { required: true, message: "Please enter the loan amount!" },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Annual Interest Rate (%)"
              name="annualInterestRate"
              rules={[
                {
                  required: true,
                  message: "Please enter the annual interest rate!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Loan Term (Years)"
              name="loanTermYears"
              rules={[
                {
                  required: true,
                  message: "Please enter the loan term in years!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Calculate
            </Button>
          </Form>
          {monthlyPayment && (
            <div className="mt-4">
              <h3>
                Your Monthly Payment:{" "}
                {new Intl.NumberFormat().format(monthlyPayment)} EGP
              </h3>
            </div>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default App;
