import React from "react";
import { Col, Row, Typography } from "antd";
import styled from "@emotion/styled";
import styles from "./InfoPanel.module.css";

const BluePanel = styled(Row)`
  background: #15527b;
  padding: 1rem;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  margin-bottom: 0.5rem;
`;

const BoldLink = styled.a`
font-weight: 700;
text-decoration: underline;
`

const InfoPanel = ({ title, subtitle, blurb, image, ctaText, ctaURL }) => {
  return (
    <BluePanel>
      <Col span={24}>
        <Typography.Title className={styles.greenText}>
          {title}
        </Typography.Title>
      </Col>
      <Col span={6} offset={9}>
        <Image src={image} />
      </Col>
      <Col span={24}>
        <Typography.Title level={3} className={styles.whiteText}>
          {subtitle}
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Text className={styles.whiteText}>{blurb}</Typography.Text>
      </Col>
      <Col span={24}>
        <BoldLink className={styles.whiteText} target="_blank" rel="noopener noreferrer" href={ctaURL}>{ctaText}</BoldLink>
      </Col>
    </BluePanel>
  );
};

export default InfoPanel;
