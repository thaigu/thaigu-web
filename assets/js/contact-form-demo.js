// ==========================================================================
// CONTACT & RESERVATION FORM - 泰谷 ThaiGu 官方門店訂座驗證腳本
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('successMessage');

  function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  function clearFieldErrors() {
    const errorElements = contactForm.querySelectorAll('.error-message');
    errorElements.forEach((el) => {
      el.textContent = '';
      el.classList.remove('show');
    });
  }

  function showSuccessMessage(message) {
    if (formSuccess) {
      formSuccess.style.display = 'flex';
      const textElem = formSuccess.querySelector('.success-text');
      if (textElem && message) textElem.textContent = message;
      setTimeout(() => {
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  // --- Real-time validation ---
  function setupRealTimeValidation() {
    const fields = {
      name: {
        element: contactForm.querySelector('#name'),
        validate: (v) => {
          if (!v || !v.trim()) return '請填寫貴賓姓名';
          if (v.trim().length < 2) return '姓名長度至少需 2 個字元';
          return null;
        },
      },
      email: {
        element: contactForm.querySelector('#email'),
        validate: (v) => {
          if (!v || !v.trim()) return '請填寫聯絡電子郵箱';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(v)) return '請輸入有效的電子郵件地址';
          return null;
        },
      },
      phone: {
        element: contactForm.querySelector('#phone'),
        validate: (v) => {
          if (!v || !v.trim()) return '請填寫聯絡電話（方便訂座確認）';
          if (!/^[\+]?[0-9][\d\s\-\(\)]{5,18}$/.test(v.trim())) {
            return '請輸入正確的聯絡電話號碼（如 +853 6865 8838）';
          }
          return null;
        },
      },
      subject: {
        element: contactForm.querySelector('#subject'),
        validate: (v) => {
          if (!v || !v.trim()) return '請選擇查詢或預約類別';
          return null;
        },
      },
      message: {
        element: contactForm.querySelector('#message'),
        validate: (v) => {
          if (!v || !v.trim()) return '請填寫預約詳情或需求備註';
          if (v.trim().length < 5) return '備註內容至少需 5 個字元（例如：到店日期與人數）';
          if (v.trim().length > 2000) return '內容字數不可超過 2000 字';
          return null;
        },
      },
    };

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      if (!field.element) return;
      const errorElement = document.getElementById(`${fieldName}Error`);

      field.element.addEventListener('blur', function () {
        const error = field.validate(this.value);
        if (error) showFieldError(fieldName, error);
        else if (errorElement) {
          errorElement.textContent = '';
          errorElement.classList.remove('show');
        }
      });

      field.element.addEventListener('input', function () {
        if (errorElement && errorElement.classList.contains('show')) {
          const error = field.validate(this.value);
          if (!error) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
          }
        }
      });
    });
  }

  setupRealTimeValidation();

  // --- Submit handler ---
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFieldErrors();
    if (formSuccess) formSuccess.style.display = 'none';

    const data = new FormData(contactForm);
    let valid = true;

    // Name
    const nameVal = (data.get('name') || '').trim();
    if (!nameVal) {
      showFieldError('name', '請填寫貴賓姓名');
      valid = false;
    }

    // Email
    const emailVal = (data.get('email') || '').trim();
    if (!emailVal) {
      showFieldError('email', '請填寫聯絡電子郵箱');
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        showFieldError('email', '請輸入有效的電子郵件地址');
        valid = false;
      }
    }

    // Phone
    const phoneVal = (data.get('phone') || '').trim();
    if (!phoneVal) {
      showFieldError('phone', '請填寫聯絡電話');
      valid = false;
    } else if (!/^[\+]?[0-9][\d\s\-\(\)]{5,18}$/.test(phoneVal)) {
      showFieldError('phone', '請輸入正確的聯絡電話號碼');
      valid = false;
    }

    // Subject
    const subjectVal = (data.get('subject') || '').trim();
    if (!subjectVal) {
      showFieldError('subject', '請選擇查詢或預約類別');
      valid = false;
    }

    // Message
    const msg = (data.get('message') || '').trim();
    if (!msg) {
      showFieldError('message', '請填寫預約詳情或需求備註');
      valid = false;
    } else if (msg.length < 5) {
      showFieldError('message', '備註內容至少需 5 個字元');
      valid = false;
    }

    if (!valid) {
      const firstError = contactForm.querySelector('.error-message.show');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 成功提示
    const name = nameVal;
    const feedbackMsg = `感謝 ${name} 閣下！泰谷 (ThaiGu) 門店服務團隊已收到您的預約與查詢需求，我們將於 24 小時內致電與您確認。急單請直接撥打門店專線：+853 2875 0222。`;
    showSuccessMessage(feedbackMsg);

    setTimeout(() => {
      contactForm.reset();
      updateCharCounter();
    }, 1200);
  });

  // --- Char counter ---
  const messageTextarea = contactForm.querySelector('#message');
  let counter = null;
  if (messageTextarea) {
    counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = 'font-size:12px;color:#6b7280;margin-top:5px;text-align:right;';
    messageTextarea.insertAdjacentElement('afterend', counter);

    messageTextarea.addEventListener('input', updateCharCounter);
    updateCharCounter();

    // Auto-resize textarea
    messageTextarea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
  }

  function updateCharCounter() {
    if (!messageTextarea || !counter) return;
    const len = messageTextarea.value.length;
    const max = 2000;
    counter.textContent = `${len}/${max} 字元`;
    if (len > max * 0.9) counter.style.color = '#f59e0b';
    else if (len > max) counter.style.color = '#dc3545';
    else counter.style.color = '#6b7280';
  }

  // UX focus styling
  const inputs = contactForm.querySelectorAll('input, select, textarea');
  inputs.forEach((inp) => {
    inp.addEventListener('focus', () => inp.closest('.form-group')?.classList.add('focused'));
    inp.addEventListener('blur', () => inp.closest('.form-group')?.classList.remove('focused'));
  });
});