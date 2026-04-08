@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* { box-sizing: border-box; }
body { margin:0; font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased; background:#f8faf9; color:#1a1a1a; }
::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#1D9E75;border-radius:3px}

.card{background:#fff;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.07);border:1px solid #f0f0f0;padding:24px}
.btn-primary{background:#1D9E75;color:#fff;font-weight:600;padding:10px 20px;border-radius:12px;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;font-size:14px;transition:all .2s;box-shadow:0 2px 8px rgba(29,158,117,.3)}
.btn-primary:hover{background:#0F6E56;box-shadow:0 4px 12px rgba(29,158,117,.4);transform:translateY(-1px)}
.btn-primary:active{transform:scale(.97)}
.btn-secondary{background:#fff;color:#1D9E75;font-weight:500;padding:10px 20px;border-radius:12px;border:1.5px solid #9FE1CB;cursor:pointer;display:inline-flex;align-items:center;gap:8px;font-size:14px;transition:all .2s}
.btn-secondary:hover{background:#E1F5EE}
.btn-danger{background:#FAECE7;color:#993C1D;font-weight:500;padding:7px 14px;border-radius:8px;border:none;cursor:pointer;font-size:13px;transition:all .2s}
.btn-danger:hover{background:#993C1D;color:#fff}
.input-field{width:100%;padding:11px 14px;border-radius:10px;border:1.5px solid #e5e7eb;font-size:14px;transition:all .2s;background:#fff;outline:none;font-family:inherit}
.input-field:focus{border-color:#1D9E75;box-shadow:0 0 0 3px rgba(29,158,117,.12)}
.label{display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px}
.badge-green{background:#E1F5EE;color:#0F6E56;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.badge-amber{background:#FAEEDA;color:#854F0B;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.badge-red{background:#FAECE7;color:#993C1D;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.badge-blue{background:#E6F1FB;color:#185FA5;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.badge-gray{background:#F1EFE8;color:#5F5E5A;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
.modal-box{background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.2);width:100%;max-width:520px;max-height:90vh;overflow-y:auto}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
.animate-fade-in{animation:fadeIn .3s ease both}
.animate-slide-in{animation:slideIn .25s ease both}
.gradient-brand{background:linear-gradient(135deg,#0F4C35 0%,#1D9E75 100%)}
