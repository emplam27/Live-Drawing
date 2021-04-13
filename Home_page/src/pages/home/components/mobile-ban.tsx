import React, { Component } from 'react';
import BanImage from '../../../images/mobile-ban.png';

class BanComponent extends Component {
  render() {
    return (
      <div className='mb-12 pb-12'>
        <h3>모바일 지원 불가 페이지</h3>
        <img src={BanImage}></img>
        <h3>가로 길이 768px 이상 부터 지원 가능</h3>
      </div>
    );
  }
}
export default BanComponent;
