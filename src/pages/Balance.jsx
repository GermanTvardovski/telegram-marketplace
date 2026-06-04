import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, Copy, Check, QrCode } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import '../styles/Balance.css'

const Balance = () => {
  const navigate = useNavigate()
  const { user, refreshUserData } = useUser()
  const [amount, setAmount] = useState('')
  const [tetherWallet, setTetherWallet] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentCreated, setPaymentCreated] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [copied, setCopied] = useState(false)

  const quickAmounts = [100, 500, 1000, 5000, 10000]

  const handleQuickAmount = (value) => {
    setAmount(value.toString())
  }

  const handleCreatePayment = async () => {
    if (!amount || !tetherWallet) {
      alert('Пожалуйста, введите сумму и кошелек Tether')
      return
    }

    const amountValue = parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Пожалуйста, введите корректную сумму')
      return
    }

    setLoading(true)
    try {
      // Демо режим - создаем фиктивный платеж
      const mockPayment = {
        payment_id: 'pay_' + Date.now(),
        payment_address: 'TX' + Math.random().toString(36).substring(2, 34),
        amount_rub: amountValue,
        amount_usdt: amountValue / 95,
        transaction_id: Date.now(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }
      setPaymentData(mockPayment)
      setPaymentCreated(true)
    } catch (error) {
      console.error('Payment creation error:', error)
      alert('Ошибка при создании платежа')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAddress = () => {
    if (paymentData?.payment_address) {
      navigator.clipboard.writeText(paymentData.payment_address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCheckStatus = async () => {
    if (!paymentData?.transaction_id) return

    setLoading(true)
    try {
      // Демо режим - случайный статус платежа
      const randomStatus = Math.random() > 0.5 ? 'completed' : 'pending'
      
      if (randomStatus === 'completed') {
        alert('Платеж успешно завершен!')
        refreshUserData() // Обновляем данные пользователя
        navigate('/account')
      } else {
        alert('Платеж еще не обработан. Попробуйте позже.')
      }
    } catch (error) {
      console.error('Status check error:', error)
      alert('Ошибка при проверке статуса')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/account')
  }

  return (
    <div className="balance-page">
      <div className="page-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">Пополнение баланса</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="container">
        {!paymentCreated ? (
          <>
            {/* Current Balance */}
            <div className="balance-card">
              <div className="balance-info">
                <span className="balance-label">Текущий баланс</span>
                <span className="balance-value">
                  {user?.balance?.toLocaleString() || 0} ₽
                </span>
              </div>
              <Wallet size={32} className="balance-icon" />
            </div>

            {/* Amount Input */}
            <div className="form-section">
              <h2 className="section-title">Сумма пополнения</h2>
              <div className="amount-input-wrapper">
                <input
                  type="number"
                  className="amount-input"
                  placeholder="Введите сумму"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="currency-label">₽</span>
              </div>

              <div className="quick-amounts">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    className="quick-amount-button"
                    onClick={() => handleQuickAmount(value)}
                  >
                    {value.toLocaleString()} ₽
                  </button>
                ))}
              </div>
            </div>

            {/* Tether Wallet Input */}
            <div className="form-section">
              <h2 className="section-title">Ваш кошелек Tether (USDT)</h2>
              <input
                type="text"
                className="wallet-input"
                placeholder="Введите адрес кошелька USDT (TRC20)"
                value={tetherWallet}
                onChange={(e) => setTetherWallet(e.target.value)}
              />
              <p className="info-text">
                Принимаются только кошельки сети TRC20. Комиссия за перевод: ~1 USDT
              </p>
            </div>

            {/* Create Payment Button */}
            <button
              className="create-payment-button"
              onClick={handleCreatePayment}
              disabled={loading}
            >
              {loading ? 'Создание платежа...' : 'Создать платеж'}
            </button>

            {/* Info Section */}
            <div className="info-section">
              <h3 className="info-title">Информация</h3>
              <ul className="info-list">
                <li>Минимальная сумма пополнения: 100 ₽</li>
                <li>Максимальная сумма пополнения: 100,000 ₽</li>
                <li>Обработка платежа занимает 5-30 минут</li>
                <li>Курс: 1 USDT ≈ 95 ₽</li>
                <li>Поддерживается сеть TRC20</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Payment Created */}
            <div className="payment-created-card">
              <div className="payment-icon">
                <QrCode size={48} />
              </div>
              <h2 className="payment-title">Платеж создан</h2>
              <p className="payment-description">
                Переведите {paymentData?.amount_usdt?.toFixed(2)} USDT на указанный адрес
              </p>
            </div>

            {/* Payment Address */}
            <div className="payment-address-card">
              <h3 className="address-title">Адрес для оплаты</h3>
              <div className="address-wrapper">
                <span className="address-text">{paymentData?.payment_address}</span>
                <button className="copy-button" onClick={handleCopyAddress}>
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <p className="address-info">
                Сеть: TRC20 | Сумма: {paymentData?.amount_usdt?.toFixed(2)} USDT
              </p>
            </div>

            {/* Payment Details */}
            <div className="payment-details-card">
              <div className="detail-row">
                <span className="detail-label">Сумма в рублях:</span>
                <span className="detail-value">{paymentData?.amount_rub?.toLocaleString()} ₽</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Сумма в USDT:</span>
                <span className="detail-value">{paymentData?.amount_usdt?.toFixed(2)} USDT</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ваш кошелек:</span>
                <span className="detail-value wallet-value">{tetherWallet}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Действует до:</span>
                <span className="detail-value">
                  {new Date(paymentData?.expires_at).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Check Status Button */}
            <button
              className="check-status-button"
              onClick={handleCheckStatus}
              disabled={loading}
            >
              {loading ? 'Проверка...' : 'Проверить статус платежа'}
            </button>

            <button
              className="cancel-button"
              onClick={() => setPaymentCreated(false)}
            >
              Отменить
            </button>

            {/* Warning */}
            <div className="warning-card">
              <p className="warning-text">
                ⚠️ Важно: Отправляйте точную сумму. Неправильные платежи не возвращаются.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Balance
