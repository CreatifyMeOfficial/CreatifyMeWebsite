<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
  <div class="footer">
    <div class="social-links">
      <div class="box lg">
        <p>{{ t('footer.whatsappLinkLabel') }}</p>
        <a href="https://wa.me/message/OAVFL6FTD57QE1" target="_blank"><i class="fa-brands fa-whatsapp lg"></i></a>
      </div>
      <div class="box sm">
        <p>{{ t('footer.emailLinkLabel') }}</p>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@creatifymeweb.com&su=Support" target="_blank"><i class="fa-regular fa-envelope mid"></i></a>
      </div>
      <div class="box lg">
        <p>{{ t('footer.facebookLinkLabel') }}</p>
        <a href="https://www.facebook.com/share/1A8Wyhr8sW/?mibextid=wwXIfr
" target="_blank"><i class="fa-brands fa-facebook mid" ></i></a>
      </div>
      <div class="box lg">
        <p>{{ t('footer.instagramLinkLabel') }}</p>
        <a href="https://www.instagram.com/creatifymeweb?igsh=aWM0dmM0MWc5cjM1&utm_source=qr" target="_blank"><i class="fa-brands fa-instagram mid"></i></a>
      </div>
      <div class="box lg">
        <p>{{ t('footer.linkedInLinkLabel') }}</p>
        <a href="https://www.linkedin.com/in/creatifyme-website-bba876396?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app
" target="_blank"><i class="fa-brands fa-linkedin mid"></i></a>
      </div>
      <div class="box sm">
        <p>{{ t('footer.discordLinkLabel') }}</p>
        <a href="https://discord.gg/kbEWxwTrZM" target="_blank"><i class="fa-brands fa-discord sm"></i></a>
      </div>
      <div class="box sm">
        <p>{{ t('footer.telegramLinkLabel') }}</p>
        <a href="https://t.me/creatifymeweb" target="_blank"><i class="fa-brands fa-telegram sm"></i></a>
      </div>
      <div class="box sm">
        <p>{{ t('footer.tiktokLinkLabel') }}</p>
        <a href="https://www.tiktok.com/@creatifymeweb" target="_blank"><i class="fa-brands fa-tiktok sm"></i></a>
      </div>
      <div class="copyright">
        <span>{{ t('footer.copyRight') }} </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.footer {
  display: flex;
  justify-content: center;
  background-image: repeating-linear-gradient(var(--secondary-color), #6f5cb6);
  box-shadow: 0 -1px 4px 0 var(--text-color);
}
.social-links {
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(3, auto);
  padding: 20px;
  box-sizing: border-box;
  gap: 0 100px;
}

.footer .box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  direction: var(--direction);
}

.footer .box.lg {
  width: 250px;
}

.footer .box.sm {
  width: 250px;
}

.footer .box p {
  font-size: 16px;
  color: var(--elements-color);
}
.footer .copyright {
  padding-top: 10px;
  grid-column: 1/3;
  font-size: 8px;
  text-align: center;
  margin: 0 auto;
  color: var(--elements-color);
}
.footer .box a i {
  color: var(--controls-color);
}

.footer .box a i.sm {
  font-size: 20px;
}

.footer .box a i.lg {
  font-size: 24px;
}

.footer .box a i.mid {
  font-size: 22px;
}

@media (max-width: 640px) {
  .social-links {
    gap: 0 25px;
  }

  .footer .social-links .box.lg {
    width: 150px;
  }

  .footer .social-links .box.sm {
    width: 150px;
  }

  .footer .social-links .box p {
    font-size: 10px;
  }

  .footer .social-links .box a i.sm {
    font-size: 16px;
  }

  .footer .social-links .box a i.lg {
    font-size: 20px;
  }

  .footer .social-links .box a i.mid {
    font-size: 18px;
  }

  .footer .social-links .copyright {
    font-size: 6px;
  }
}
</style>
