<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
  <div class="about">
    <div class="desc">
      <div class="cont">
        <p>
          {{ t('aboutUs.welcome') }} <router-link class="main" to="/">Creatify Me</router-link>
          {{ t('aboutUs.description') }}
        </p>
        <img src="../assets/images/mainImage.svg" alt="" />
      </div>
    </div>
    <div class="our-mission">
      <span class="main-title">{{ t('aboutUs.mission.title') }}</span>
      <p class="text-one">
        {{ t('aboutUs.mission.description') }}
      </p>
      <p class="text-two">
        {{ t('aboutUs.mission.subtitle') }}
      </p>
      <div class="info">
        <div class="box">
          <i class="fa-solid fa-caret-right"></i>
          <span>{{ t('aboutUs.mission.discover.title') }}</span>
          <p class="content">
            {{ t('aboutUs.mission.discover.description') }}
          </p>
        </div>
        <div class="box">
          <i class="fa-solid fa-caret-right"></i>
          <span>{{ t('aboutUs.mission.develop.title') }}</span>
          <p class="content">
            {{ t('aboutUs.mission.develop.description') }}
          </p>
        </div>
        <div class="box">
          <i class="fa-solid fa-caret-right"></i>
          <span>{{ t('aboutUs.mission.thrive.title') }}</span>
          <p class="content">{{ t('aboutUs.mission.thrive.description') }}</p>
        </div>
      </div>
    </div>
    <div class="our-vision">
      <span class="main-title">{{ t('aboutUs.vision.title') }}</span>
      <p class="text-one">
        {{ t('aboutUs.vision.description') }}
      </p>
      <p class="text-two">{{ t('aboutUs.vision.subtitle') }}</p>
      <div class="info">
        <div class="box">
          <i class="fa-solid fa-caret-right"></i>
          <span>{{ t('aboutUs.vision.personalizedPathways.title') }}</span>
          <p class="content">
            {{ t('aboutUs.vision.personalizedPathways.description') }}
          </p>
        </div>
        <div class="box">
          <i class="fa-solid fa-caret-right"></i>
          <span>{{ t('aboutUs.vision.holisticGrowth.title') }}</span>
          <p class="content">
            {{ t('aboutUs.vision.holisticGrowth.description') }}
          </p>
        </div>
        <div class="box">
          <i class="fa-solid fa-caret-right"></i>
          <span>{{ t('aboutUs.vision.communityImpact.title') }}</span>
          <p class="content">
            {{ t('aboutUs.vision.communityImpact.description') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.about {
  text-align: center;
  margin: 0 auto;
  width: 80%;
  padding: 50px 0;
}
.desc {
  display: flex;
  justify-content: center;
}

.desc .cont {
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
}

.our-mission,
.our-vision {
  width: 70%;
  margin: 25px auto;
}

.desc p {
  width: 65%;
  padding-right: 10px;
  font-size: 24px;
  text-align: start;
}

.desc p .main {
  color: var(--main-color);
  font-size: 24px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.desc img {
  width: 300px;
}

.main-title {
  color: var(--main-color);
  font-size: 28px;
  font-weight: 700;
}

.text-one,
.text-two {
  font-size: 24px;
  padding-bottom: 10px;
}

.info .box {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  justify-content: start;
  align-items: center;
  text-align: start;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 15px;
}

.info .box i {
  color: var(--main-color);
  font-size: 22px;
  padding-right: 10px;
  align-items: center;
}

[style*='--direction: rtl'] {
  .info .box i {
    transform: rotateZ(180deg);
  }
}

.info .box span {
  font-weight: 600;
  font-size: 22px;
}

.info .box .content {
  margin: 0 auto;
  margin: 0 5px;
  font-size: 20px;
  text-align: start;
  grid-column: 2;
}

.desc .b-left {
  display: none;
}
@media (min-width: 768px) and (max-width: 991px) {
  .desc .cont {
    width: 100%;
  }

  .about .desc p {
    width: 100%;
  }

  .about .desc .cont img {
    display: none;
  }

  .our-mission,
  .our-vision {
    width: 100%;
  }
}
@media (max-width: 767px) {
  .about {
    width: 100%;
    padding-top: 0;
  }
  .desc {
    background-color: var(--main-color);
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 50px 0;
  }

  .desc img {
    display: none;
  }

  .info .box {
    width: 80%;
  }

  .desc .cont {
    display: flex;
    width: 90%;
    justify-content: center;
  }

  .desc .b-left {
    display: block;
    border-left: 4px solid var(--controls-color);
  }

  .desc p {
    color: var(--elements-color);
    padding-left: 10px;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 14px;
    width: 100%;
  }
  .desc p .main {
    color: var(--controls-color);
    font-size: 16px;
    font-weight: 600;
  }
  .our-mission,
  .our-vision {
    width: 85%;
  }
  .main-title {
    font-size: 18px;
  }
  .info .box i {
    font-size: 14px;
  }

  .info .box span {
    font-size: 16px;
  }

  .info .box .content {
    font-size: 14px;
  }

  .text-one,
  .text-two {
    font-size: 14px;
  }
}
</style>
