import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../App.css';
import { Row, Col, Layout, List, Avatar, Divider, Radio, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import { connect } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckout from 'react-stripe-checkout';

import Nav from './Nav'
import FooterComp from './Footer';
const stripePromise = loadStripe('pk_test_T60y6sAVREOC6Dq9Cixjjx6I00TSGd4n7j');
const { Content } = Layout;


function ScreenBasket(props) {

    const [infoUsername, setInfoUsername] = useState();
    const [articleList, setArticleList] = useState([])

    var userToken;

    useEffect(() => {
        async function loadUser() {

            //Récupération du token dans localStorage
            userToken = localStorage.getItem('token', (err, value) => {
            })

            if (userToken) {

                const rawResponse = await fetch(`/users/loadinfo/${userToken}`);
                const response = await rawResponse.json();

                if (response.user) {
                    setInfoUsername(response.user.username)
                }
            } else {
                return <Redirect to='/' />
            }
        }
        loadUser();
    }, [userToken]);


    // var userBasket 

    // useEffect(() => {
    //     async function storage() {
    //         localStorage.getItem("article", function (error, data) {
    //             console.log(data);
    //             userBasket = JSON.parse(data);
    //             console.log(userBasket.article);
    //         })
    //     }
    //     storage();
    // }, []);

    // console.log(userBasket)

    useEffect(() => {
        async function articleList() {
            setArticleList(props.order)
        }
        articleList();
    }, [articleList]);


    let totalCommande = 0

    let totalFinal = 0
    for (let i = 0; i < articleList.length; i++) {
        totalCommande = articleList[i].priceUnit * articleList[i].quantity
        totalFinal += articleList[i].priceUnit * articleList[i].quantity
    }


    if (totalCommande == NaN) {
        totalCommande = 0
    }

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    const [radioValue, setRadioValue] = useState('')

    var onChange = e => {
        console.log('radio checked', e.target.value);
        setRadioValue(e.target.value);
    };


    var deleteArticle = index => {
        var indexItem = articleList.indexOf(index)
        setArticleList(articleList.splice(indexItem, 1));
        localStorage.removeItem("article")
    }

    return (

        <Layout className="layout" style={{ height: '100vh', backgroundColor: 'white' }}>
            <Nav />

            <Content style={{ padding: '0 50px', margin: '40px 0' }} className="Basket-page">

                <Row>
                    <Col md={{ span: 11 }} sm={{ span: 24 }}>
                        <h2 style={{ fontWeight: 700, fontSize: 25 }}>Bienvenue {infoUsername} !</h2>
                    </Col>
                    <Col md={{ span: 13 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                        <h1 style={{ fontWeight: 700, fontSize: 40 }}>Panier</h1>
                    </Col>
                </Row>

                <Row style={{ marginTop: 40 }} align='middle'>
                    <Col md={{ span: 12 }} sm={{ span: 24 }}>
                        <h2>Produit(s) en attente</h2>
                        <div id="dashboard-box">

                            <List
                                style={{ margin: "10px 15px 0 10px" }}
                                dataSource={articleList}
                                renderItem={item => (
                                    <List.Item
                                        actions={[<a key="list-delete"><DeleteOutlined style={{ size: 24 }} onClick={() => deleteArticle(item)} /></a>]}
                                    >
                                        {/* <List.Item.Meta

                                            title={item.title}
                                        
                                            /> */}
                                        <List.Item.Meta
                                            description={"Description : " + item.description}

                                        />

                                <List.Item.Meta
                                          description={"Couleur sélectionnée : " + item.colors}
                                        />
                                   
 <List.Item.Meta
description={"Qualité choisie : " + item.quality}
/>
<List.Item.Meta
description={"Quantité : " + item.quantity}
/>

<List.Item.Meta
style ={{fontWeight : 600}}
description={"Total de cette commande : " + (item.priceUnit * item.quantity) + ' €'}
/>

</List.Item>
                                )}

                            />

                            <Divider />
                            <div id="total">
                                <p style={{ fontSize: 18, fontWeight: 700 }}>TOTAL : {totalFinal} €</p>
                            </div>

                        </div>
                        <Link to="/fabricant/:id"><Button>Continuer la commande chez ce fabricant </Button></Link>
                        <Link to="/map"><Button>Retourner à la liste des fabricants</Button></Link>
                    </Col>

                    <Col md={{ span: 12 }} sm={{ span: 24 }}>

                        <div id="retrait">
                            <h2>Moyen de retrait</h2>
                            <Radio.Group onChange={onChange} value={radioValue}>
                                <Radio style={radioStyle} value={'Retrait'}>
                                    Retrait
                                 </Radio>
                                <Radio style={radioStyle} value={'Livraison'}>
                                    Livraison
                             </Radio>
                            </Radio.Group>
                            <h2>Procéder au paiement</h2>




                            {/* Stripe */}
                            <StripeCheckout
                                amount={totalFinal * 100} //TO DO --> Dynamiser
                                billingAddress
                                name="Masques.org"
                                description="Masques personnalisés"
                                /* image= '../images/logo.png'  */
                                locale="auto"
                                stripeKey="pk_test_coUidDoFWymEAbFlak3JlqPf00PqNkwObW"//TO DO --> Changer
                                token={props.token}
                                zipCode
                                label="Payer avec Stripe 💳"
                                panelLabel="Acheter pour {{amount}} €"
                            />

                        </div>
                    </Col>
                </Row>



            </Content>

            <FooterComp />
        </Layout>
    );
}


function mapStateToProps(state) {
    return {
        token: state.userToken,
        order: state.basketList
    }
}

export default connect(mapStateToProps, null)(ScreenBasket)

