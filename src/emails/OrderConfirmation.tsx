// src/emails/OrderConfirmation.tsx

import {
  Html,
  Head,
  Body,
  Preview,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
} from '@react-email/components';

import * as React from 'react';

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface EmailProps {
  customerName: string;
  orderId: string;
  items: CartItem[];
  totalPrice: number;
}

export const OrderConfirmationEmail: React.FC<EmailProps> = ({
  customerName,
  orderId,
  items,
  totalPrice,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Xác nhận đơn hàng #{orderId} - ThapCamStore</Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Header với tên shop */}
          <Section style={headerSection}>
            <Heading style={shopName}>ThapCamStore</Heading>
            <Text style={shopTagline}>Gi gỉ gì gi cái gì cũng có</Text>
          </Section>

          <Hr style={hr} />

          {/* Success Message */}
          <Section style={successSection}>
            <Text style={successIcon}>✓</Text>
            <Heading style={heading}>Đặt hàng thành công!</Heading>
          </Section>

          <Text style={text}>Chào {customerName},</Text>

          <Text style={text}>
            Cảm ơn bạn đã tin tưởng và mua hàng tại ThapCamStore. Đơn hàng{' '}
            <strong>#{orderId}</strong> của bạn đã được tiếp nhận và đang được xử lý.
          </Text>

          {/* CTA Button
          <Section style={buttonContainer}>
            <Button style={button} href={`https://thap-cam-store.vercel.app/cart/order-success`}>
              Xem đơn hàng của tôi
            </Button>
          </Section>

          <Hr style={hr} /> */}

          {/* Order Details */}
          <Heading as="h2" style={subHeading}>
            Chi tiết đơn hàng
          </Heading>

          <Section style={orderInfoBox}>
            <Text style={orderInfoText}>
              <strong>Mã đơn hàng:</strong> #{orderId}
            </Text>
            <Text style={orderInfoText}>
              <strong>Ngày đặt:</strong>{' '}
              {new Date().toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Text>
          </Section>

          {/* Items List */}
          <Section style={itemsContainer}>
            <table style={itemsTable}>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={itemRow}>
                    <td style={itemNameCell}>
                      <Text style={itemName}>{item.name}</Text>
                      <Text style={itemQuantity}>Số lượng: {item.quantity}</Text>
                    </td>
                    <td style={itemPriceCell}>
                      <Text style={itemPrice}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Total */}
          <Section style={totalSection}>
            <table style={totalTable}>
              <tbody>
                <tr>
                  <td style={totalLabelCell}>
                    <Text style={totalText}>Tổng cộng</Text>
                  </td>
                  <td style={totalPriceCell}>
                    <Text style={totalPriceText}>{totalPrice.toLocaleString('vi-VN')}₫</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Support Section */}
          <Section style={supportSection}>
            <Heading as="h3" style={supportHeading}>
              Cần hỗ trợ?
            </Heading>
            <Text style={supportText}>
              Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi:
            </Text>
            <Text style={supportText}>
              📧 Email: hoanganhan04@gmail.com
              <br />
              📞 Hotline: 0962920948
              <br />
              📍 Địa chỉ: Số 3 phố Cầu Giấy, Phường Láng Thượng, Quận Đống Đa, TP. Hà Nội
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} ThapCamStore. All rights reserved.
            </Text>
            <Text style={footerText}>
              Email này được gửi tự động, vui lòng không trả lời trực tiếp.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

// --- Styles ---

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const headerSection = {
  backgroundColor: '#1f2937',
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const shopName = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold' as const,
  margin: '0 0 8px 0',
  fontStyle: 'italic',
};

const shopTagline = {
  color: '#d1d5db',
  fontSize: '14px',
  margin: '0',
};

const successSection = {
  textAlign: 'center' as const,
  padding: '40px 40px 20px',
};

const successIcon = {
  fontSize: '48px',
  color: '#10b981',
  margin: '0',
  lineHeight: '1',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#1f2937',
  margin: '16px 0 0 0',
  textAlign: 'center' as const,
};

const subHeading = {
  fontSize: '20px',
  fontWeight: 'bold' as const,
  color: '#374151',
  margin: '0 0 16px 0',
  padding: '0 40px',
};

const text = {
  fontSize: '16px',
  color: '#4b5563',
  lineHeight: '24px',
  margin: '12px 0',
  padding: '0 40px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  padding: '24px 40px',
};

const button = {
  backgroundColor: '#1f2937',
  color: '#ffffff',
  padding: '14px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  display: 'inline-block',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const orderInfoBox = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  margin: '0 40px 20px',
  borderRadius: '6px',
  borderLeft: '4px solid #1f2937',
};

const orderInfoText = {
  fontSize: '14px',
  color: '#374151',
  margin: '4px 0',
  lineHeight: '20px',
};

const itemsContainer = {
  padding: '0 40px',
  margin: '0',
};

const itemsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const itemRow = {
  borderBottom: '1px solid #e5e7eb',
};

const itemNameCell = {
  padding: '16px 16px 16px 0',
  verticalAlign: 'top' as const,
  width: '70%',
};

const itemPriceCell = {
  padding: '16px 0',
  verticalAlign: 'top' as const,
  textAlign: 'right' as const,
  width: '30%',
};

const itemName = {
  fontSize: '15px',
  color: '#1f2937',
  fontWeight: '600' as const,
  margin: '0 0 4px 0',
  lineHeight: '20px',
};

const itemQuantity = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '0',
  lineHeight: '18px',
};

const itemPrice = {
  fontSize: '16px',
  color: '#1f2937',
  fontWeight: 'bold' as const,
  margin: '0',
  lineHeight: '20px',
};

const totalSection = {
  padding: '0 40px 20px',
  backgroundColor: '#ffffff',
  margin: '0',
};

const totalTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const totalLabelCell = {
  padding: '20px 16px 20px 0',
  textAlign: 'left' as const,
  backgroundColor: '#f9fafb',
  borderRadius: '8px 0 0 8px',
};

const totalPriceCell = {
  padding: '20px 0',
  textAlign: 'right' as const,
  backgroundColor: '#f9fafb',
  borderRadius: '0 8px 8px 0',
};

const totalText = {
  fontSize: '18px',
  color: '#1f2937',
  fontWeight: 'bold' as const,
  margin: '0',
};

const totalPriceText = {
  fontSize: '24px',
  color: '#1f2937',
  fontWeight: 'bold' as const,
  margin: '0',
};

const supportSection = {
  padding: '24px 40px',
  backgroundColor: '#fefce8',
  margin: '0',
};

const supportHeading = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  color: '#92400e',
  margin: '0 0 12px 0',
};

const supportText = {
  fontSize: '14px',
  color: '#78350f',
  lineHeight: '20px',
  margin: '8px 0',
};

const footer = {
  padding: '24px 40px',
  backgroundColor: '#f9fafb',
};

const footerText = {
  fontSize: '12px',
  color: '#9ca3af',
  lineHeight: '18px',
  textAlign: 'center' as const,
  margin: '4px 0',
};
