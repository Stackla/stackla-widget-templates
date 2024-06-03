export default `
  :host {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .shopspots {
    position: relative;
    height: 100%;
  }
  .stacklapopup-shopspot {
    border-radius: 50%;
    box-sizing: border-box;
    cursor: default;
    overflow: visible;
    position: absolute;
    transition-property: top, left, opacity;
    transition-duration: .5s;
    width: 32px;
    z-index: 2;
    position: relative;
  }
  
  .stacklapopup-shopspot span {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .stacklapopup-shopspot-icon {
    background: rgba(255, 255, 255, .8);
    border-radius: 50%;
    cursor: pointer;
    font-weight: bold;
    position: absolute;
    text-align: center;
    width: 32px;
    height: 32px;
    top: -10px;

    }
    
    .stacklapopup-shopspot-flyout-title {
      overflow: visible;
      background: rgba(0, 0, 0, .8);
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      margin: 10px 0;
      padding: 10px 15px;
      position: absolute;
      text-overflow: ellipsis;
      top: 34px;
      white-space: nowrap;
    }
    
    .stacklapopup-shopspot-flyout-title::after {     
      border: 8px solid rgba(0, 0, 0, 0);
      border-top: none;
      border-bottom: 8px solid rgba(0, 0, 0, .8);
      content: " ";
      height: 0;
      left: 9px;
      position: absolute;
      top: -8px;
      width: 0;
     }
   
`;
