import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

import PGCFooter from '../../../components/Navigation/Footer/Footer';

import logoImage from '../../../assets/images/logo.png'
import styles from './SimpleLayout.module.css';

class SimpleLayout extends Component {

    
    render() {
        return (<Layout className={styles.SimpleLayout}>
            <Layout.Header style={{padding: "0 10px", background: "white", borderBottom: "1px solid lightgrey"}}>
                <nav>
                    <Link style={{display: 'block', color: "rgba(0, 0, 0, 0.85)", textDecoration: "none"}} to='/'>
                        <div className={styles.Logo}>
                            <img src={logoImage} alt="logo" />
                            <span>Project Grand Canyon</span>
                        </div>
                    </Link>
                </nav>
            </Layout.Header>
            <Layout.Content style={{backgroundColor: "white"}}>
                { this.props.children }
            </Layout.Content>
            <Layout.Footer style={{backgroundColor: "white"}}>
                <PGCFooter />
            </Layout.Footer>
        </Layout>);
    }
}

export default SimpleLayout;