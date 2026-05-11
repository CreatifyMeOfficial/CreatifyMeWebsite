<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import paymentsApi from '@/api/payments'
import CustomButtonComponent from '@/components/customButtonComponent.vue'

const { t } = useI18n()
const router = useRouter()

// Go to the payment page using the url from the api response
async function proceedToPayment() {
  const response = await paymentsApi.createOrder()
  if (response?.status === 200) {
    window.location.href = response.data.url
    return
  }
}

// Go back to the test page
function returnToTest() {
  router.push('/test')
}
</script>

<template>
  <div class="checkout-product-page">
    <div class="checkout-product-container">
      <img src="../assets/Images/secondaryLogo.svg" alt="" />
      <div class="detail">
        <span class="detail-title">{{ t('checkoutProduct.productTitle') }}</span>
        <span class="detail-description">{{ t('checkoutProduct.productDescription') }}</span>
      </div>
      <span class="price">{{ t('checkoutProduct.productTotal') }}</span>
      <div class="controls">
        <customButtonComponent
          :content="t('buttons.continue')"
          @click="proceedToPayment"
        ></customButtonComponent>
        <customButtonComponent
          :content="t('buttons.cancel')"
          @click="returnToTest"
        ></customButtonComponent>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-product-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-product-container {
  width: 500px;
  height: 350px;
  background: var(--elements-color);
  box-shadow: 1px 2px 4px var(--text-color);
  border-radius: 5px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 15px;
}

.checkout-product-container img {
  width: 150px;
  height: 150px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  font-family: 'Montserrat', sans-serif;
  color: var(--text-color);
  font-style: italic;
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
}

.detail-description {
  font-size: 16px;
}

.price {
  font-weight: 900;
  text-align: center;
  color: var(--controls-color);
  font-size: 20px;
  text-shadow: 1px 1px 2px var(--main-color);
}

.controls {
  display: flex;
  gap: 15px;
  padding: 10px 0;
}

.controls button {
  width: 150px;
  background-color: var(--controls-color);
}

@media (max-width: 767px) {
  .checkout-product-container {
    width: 300px;
    height: 250px;
    gap: 10px;
  }

  .checkout-product-container img {
    width: 75px;
    height: 75px;
  }

  .detail-title {
    font-size: 16px;
  }

  .detail-description {
    font-size: 14px;
  }

  .price {
    font-size: 18px;
  }
}
</style>
