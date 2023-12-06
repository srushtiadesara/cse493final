"use strict";

(function() {

  // The currently active btn.
  let currentBtn = null;

  // The currently active theme.
  let currentThemeBtn = null;

  window.addEventListener('load', init);

  function init() {
    const fontSizeSetting = localStorage.getItem('fontSize');
    if (fontSizeSetting) {
      changeFontSizeHelper(fontSizeSetting);
      const currentBtn = document.getElementById(fontSizeSetting);
      changeBtnStyle(null, currentBtn);
    } else {
      changeBtnStyle(null, document.getElementById('medium'));
    }

    const fontColorSetting = localStorage.getItem('fontColor');
    const bgColorSetting = localStorage.getItem('bgColor');
    const borderSetting = localStorage.getItem('borderStyle');
    const sidebarColorSetting = localStorage.getItem('sidebarColor')
    const activeTheme = document.getElementById(localStorage.getItem('activeThemeID'));
    if (fontSizeSetting && fontColorSetting && bgColorSetting && borderSetting && activeTheme) {
      changeColorHelper(fontColorSetting, bgColorSetting, sidebarColorSetting);
      changeBorderStyle(borderSetting);
      changeThemeBtnStyle(null, activeTheme);
    } else {
      changeBorderStyle("solid");
      changeThemeBtnStyle(null, document.getElementById('t1'));
    }
    changeFontSize();
    changeColor();

    // Attach functions to the window object
    window.openChat = openChat;
    window.sendMessage = sendMessage;
    window.closeChat = closeChat;
    // Allows 'enter' key to be used to send messages
    enterKeyBehavior();
  }

  function changeColor() {
    let themeButton = document.querySelectorAll('.aa-text');
    themeButton.forEach((themeBtn) => {
      themeBtn.addEventListener('click', () => {
        console.log('clicked');
        let tTheme = themeBtn.id;
        const root = document.documentElement;

        let fontColor = '--' + tTheme + '-color';

        let borderStyle;
        let bgColor;
        let sidebarColor;
        if (tTheme === 't1') {
          bgColor = '--t1-bg-color';
          borderStyle = 'solid';
          sidebarColor = '#1A1A1A'
        } else if (tTheme === 't2') {
          bgColor = '--t2-bg-color';
          borderStyle = 'solid';
          sidebarColor = '#111111';
        } else {
          bgColor = '--t3-t4-t5-t6-bg-color';
          borderStyle = 'solid';
          sidebarColor = 'black';
        }

        const fColor = getComputedStyle(root).getPropertyValue(fontColor).trim();
        const bColor = getComputedStyle(root).getPropertyValue(bgColor).trim();
        localStorage.setItem('fontColor', fColor);
        localStorage.setItem('bgColor', bColor);
        localStorage.setItem('borderStyle', borderStyle);
        localStorage.setItem('sidebarColor', sidebarColor);
        localStorage.setItem('activeThemeID', tTheme);

        changeColorHelper(fColor, bColor, sidebarColor);
        changeBorderStyle(borderStyle);
        changeThemeBtnStyle(currentThemeBtn, themeBtn)
      })
    })
  }

  function changeBorderStyle(borderStyle) {
    document.documentElement.style.setProperty('--border-style', borderStyle);
  }

  function changeColorHelper(fontColor, bgColor, sidebarColor) {
    document.documentElement.style.setProperty('--default-font-color', fontColor);
    document.documentElement.style.setProperty('--card-text-color', fontColor);
    document.documentElement.style.setProperty('--card-background-color', bgColor);
    document.documentElement.style.setProperty('--sidebar-color', sidebarColor);
  }

  function changeFontSize() {
    let smallBtn = document.querySelector('.small-font');
    let mediumBtn = document.querySelector('.medium-font');
    let largeBtn = document.querySelector('.large-font');

    smallBtn.addEventListener('click', () => {
      changeBtnStyle(currentBtn, smallBtn);
      changeFontSizeHelper('small');
      localStorage.setItem('fontSize', 'small');
    })
    mediumBtn.addEventListener('click', () => {
      changeBtnStyle(currentBtn, mediumBtn);
      changeFontSizeHelper('medium');
      localStorage.setItem('fontSize', 'medium');
    })
    largeBtn.addEventListener('click', () => {
      changeBtnStyle(currentBtn, largeBtn);
      changeFontSizeHelper('large');
      localStorage.setItem('fontSize', 'large');
    })
  }

  function changeFontSizeHelper(size) {
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '12px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '20px';
        break;
      default:
        root.style.fontSize = '16px';
    }
  }

  function changeBtnStyle(oldBtn, newBtn) {
    const root = document.documentElement;
    const primaryBtnColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    const activeBtnColor = getComputedStyle(root).getPropertyValue('--btn-active-color').trim();
    if (oldBtn) {
      oldBtn.style.backgroundColor = primaryBtnColor;
      oldBtn.style.color = 'black';
      oldBtn.style.border = 'none';
    }
    newBtn.style.backgroundColor = activeBtnColor;
    newBtn.style.color = 'white';
    newBtn.style.border = '4px solid ' + primaryBtnColor;
    currentBtn = newBtn;
  }

  function changeThemeBtnStyle(oldThemeBtn, newThemeBtn) {
    const root = document.documentElement;
    const borderColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    if (oldThemeBtn) {
      oldThemeBtn.style.border = '1px solid white';
    }
    newThemeBtn.style.border = '5px solid ' + borderColor;
    currentThemeBtn = newThemeBtn;
  }

  // &&&&&&&&&&&&&&&&&&& Chat Feature Below &&&&&&&&&&&&&&&&&&&

  function openChat(friendName) {
    document.getElementById('discover').style.display = 'none';
    document.querySelector('.discover-section').style.display = 'none';

    document.getElementById('chatbox').style.display = 'block';
    document.getElementById('friend-name').textContent = `Chat with ${friendName}`;
    // Clear previous messages if any
    document.getElementById('chat-messages').innerHTML = '';
  }

  function closeChat() {
    document.getElementById('discover').style.display = 'block';
    document.querySelector('.discover-section').style.display = 'block';

    document.getElementById('chatbox').style.display = 'none';
  }

  function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        // Display the message in chat
        const chatMessages = document.getElementById('chat-messages');
        const newMessageDiv = document.createElement('div');
        newMessageDiv.textContent = 'You: ' + message;
        chatMessages.appendChild(newMessageDiv);

        // Clear the input field
        input.value = '';
    }
  }

  function enterKeyBehavior() {
    // Add keypress event listener to the message input
    document.getElementById('message-input').addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent the default Enter key action (new line or form submit)
          sendMessage();
      }
    });
  }

})();

