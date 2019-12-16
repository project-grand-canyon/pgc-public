import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Layout, Popover, Typography } from 'antd';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

import NavMenu from '../../../components/Navigation/NavMenu/NavMenu';
import PGCFooter from '../../../components/Navigation/Footer/Footer';

import logoImage from '../../../assets/images/logo.png'
import styles from './ResponsiveLayout.module.css';

const MOBILE_BREAKPOINT = 768;

class ResponsiveLayout extends Component {

    state = {
        viewportWidth: 0,
        menuVisible: false,
    };
    
    componentDidMount() {
        this.saveViewportDimensions();
        window.addEventListener('resize', this.saveViewportDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.saveViewportDimensions);
    }
    
    handleMenuVisibility = (menuVisible) => {
        this.setState({ menuVisible });
    };
    
    saveViewportDimensions = throttle(() => {
        this.setState({
            viewportWidth: window.innerWidth,
        })
    }, this.props.applyViewportChange);

    render() {

        const navMenu = <NavMenu activeLinkKey={this.props.activeLinkKey} />;

        const mobileMenu = (
            <Popover
                content={navMenu}
                trigger='click'
                placement="bottomRight"
                onVisibleChange={this.handleMenuVisibility}
            >
                <Icon
                className='iconHamburger'
                type='menu'
                />
            </Popover>
        );

        const menu = (this.state.viewportWidth > MOBILE_BREAKPOINT) ? navMenu : mobileMenu;

        return (<Layout className={styles.ResponsiveLayout}>
            <Layout.Header className={styles.Header}>
                <nav>
                    <Link style={{display: 'block', textDecoration: "none"}} to='/'>
                        <div className={styles.Logo}>
                            <img src={logoImage} alt="logo" />
                            <Typography.Title level={4} style={{marginBottom: 0, color: "#111111"}}>Monthly Calling Campaign</Typography.Title>
                        </div>
                    </Link>
                    {menu}
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

ResponsiveLayout.propTypes = {
    activeLinkKey: PropTypes.string.isRequired
};

export default ResponsiveLayout;