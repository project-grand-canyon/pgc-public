import React, { Component } from 'react';

import Header from '../../components/Navigation/Header/Header';
import Footer from '../../components/Navigation/Footer/Footer';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import styles from './Layout.module.css';

class Layout extends Component {

	state = {
        showSideDrawer: false
    };
    
    sideDrawerClosedHander = () => {
        this.setState(
            {showSideDrawer: false}
        )
    };
    
    sideDrawerOpenedHander = () => {
        this.setState(
            {showSideDrawer: true}
        )
    };

	render() {
		return (
            <>
                <Header openedSideDrawer={this.sideDrawerOpenedHander}></Header>
                <SideDrawer show={this.state.showSideDrawer} closed={this.sideDrawerClosedHander} />
                <main className={styles.Content}>
                    {this.props.children}
                </main>
                <Footer />
            </>
        );
	}
}

export default Layout;
