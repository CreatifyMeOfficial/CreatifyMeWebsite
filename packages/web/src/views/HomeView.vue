<script setup>
// Importing Vue components:
// - testFeatures: Component for displaying feature cards
// - userReview: Component for displaying user testimonials
import testFeatures from '@/components/testFeatures.vue'
import UserReview from '../components/userReview.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import commentsApi from '@/api/comments'
import isLoggedIn from '@/helperMethods/checkLoginState'
import customButtonComponent from '@/components/customButtonComponent.vue'
import createNotification from '@/notification/notification'
import notificationTypes from '@/enums/notificationTypes'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const comment = ref('')
const comments = ref([])
const router = useRouter()
const isLoadingComments = ref(true)

async function loadComments() {
  try {
    const response = await commentsApi.getComments({ page: 1, limit: 4 })
    comments.value = response.data.comments
    isLoadingComments.value = false
  } catch {
    return
  }
}

async function createComment() {
  try {
    if (!isLoggedIn()) {
      createNotification(t('notifications.loginRequired'), notificationTypes.Warning, 5)
      return
    }
    if (comment.value.trim() === '') {
      createNotification(t('notifications.commentRequired'), notificationTypes.Warning, 5)
      return
    }

    if (comment.value.length > 300){
      createNotification(t('notifications.validateComment'), notificationTypes.Warning, 5)
      return
    }

    const response = await commentsApi.createComment({ comment: comment.value })
    if (response.status === 201) {
      await loadComments()
    }
  } catch {
    return
  } finally {
    comment.value = ''
  }
}

onMounted(async () => {
  await loadComments()
})
</script>

<template>
  <!-- Main hero section with intro content and image -->
  <div class="home-intro">
    <div class="home-description">
      <span class="title">Creatify Me</span>
      <span class="sub-title">{{ t('slogan') }}</span>
      <p>
        {{ t('projectGoal') }}
      </p>
      <p>
        {{ t('ourBeliefs') }}
      </p>
      <!-- Search input section -->
      <!-- <div class="search-part">
        <input class="input-search" type="text" :placeholder="t('search.placeholder')" />
        <i class="fa-solid fa-magnifying-glass"></i>
      </div> -->
    </div>
    <div class="home-img">
      <img src="@/assets/Images/mainImage.svg" alt="" />
    </div>
  </div>

  <!-- Features/testimonials section -->
  <div class="home-test">
    <!-- Container for feature cards -->
    <div class="step-test">
      <testFeatures
        path="fa-solid fa-magnifying-glass"
        :title="t('features.testYourself.title')"
        :desc="t('features.testYourself.description')"
      ></testFeatures>
      <testFeatures
        path="fa-solid fa-graduation-cap"
        :title="t('features.developSkills.title')"
        :desc="t('features.developSkills.description')"
      ></testFeatures>
      <testFeatures
        path="fa-solid fa-rocket"
        :title="t('features.ignitePassion.title')"
        :desc="t('features.ignitePassion.description')"
      ></testFeatures>
    </div>
    <!-- Call-to-action button -->
    <customButtonComponent
      class="home-test-btn"
      :buttonType="'button'"
      :content="t('buttons.startTest')"
      @click="() => router.push('/test')"
    >
    </customButtonComponent>
  </div>

  <!-- User reviews section -->
  <div class="home-user-review">
    <span>{{ t('userReviews.title') }}</span>
    <div class="user-list">
      <UserReview
        v-for="comment in comments"
        :key="comment.id"
        :desc="comment.comment"
        :img="comment.createdBy.image"
        :title="comment.createdBy.userName"
      ></UserReview>
      <template v-if="isLoadingComments || comments.length === 0">
        <div class="placeholder" v-for="index in 4" :key="index">
          <div class="placeholder-image"></div>
          <div class="placeholder-line"></div>
          <div class="placeholder-content">
            <div class="one"></div>
            <div class="two"></div>
          </div>
        </div>
      </template>

    </div>
    <router-link class="comments-link" to="comments">{{ t('userReviews.commentsLink') }}</router-link>
  </div>

  <!-- User comment form section -->
  <div class="home-user-comment">
    <img src="../assets/Images/commentVector.svg" alt="" />
    <!-- Comment form -->
    <div class="user-comment">
      <span>{{ t('comments.title') }}</span>
      <input type="text" v-model="comment" :placeholder="t('comments.placeholder')" />
      <customButtonComponent
        class="comment-btn"
        :buttonType="'button'"
        :content="t('buttons.comment')"
        @click="createComment"
      ></customButtonComponent>
    </div>
  </div>
</template>

<style scoped>
/* Styles for the main intro section */
.home-intro {
  width: 70%;
  display: flex;
  margin: 75px auto;
  align-items: center;
  justify-content: space-between;
}

/* Styles for the description text section */
.home-description {
  width: 55%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Title text styling */
.home-description .title {
  font-family: 'Playfair Display', serif;
  color: var(--main-color);
  font-size: 42px;
  text-shadow: 0 1px 2px var(--text-color);
}

/* Subtitle text styling */
.home-description .sub-title {
  font-family: 'Playball', cursive;
  color: var(--main-color);
  font-size: 34px;
  text-align: center;
}

/* Paragraph text styling */
.home-description p {
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  color: var(--text-color);
  font-style: italic;
}

/* Search input container styling */
/* .home-description .search-part {
  display: flex;
  align-items: center;
  position: relative;
  width: 80%;
} */

/* Search input field styling */
/* .home-description .search-part .input-search {
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  border-radius: 15px;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  color: var(--text-color);
  border: none;
  text-align: center;
  font-size: 18px;
  padding: 15px;
  background-color: var(--elements-color);
  margin: 20px 0;
} */

/* Search placeholder text styling */
/* .home-description .search-part .input-search::placeholder {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-style: italic;
} */

/* Search icon styling */
/* .home-description .search-part i {
  position: absolute;
  left: 10px;
  color: var(--icon-color);
} */

/* Main image container styling */
.home-img {
  width: 35%;
  display: flex;
  justify-content: center;
}

/* Main image styling */
.home-img img {
  width: 300px;
}

/* Features/test section styling */
.home-test {
  display: flex;
  flex-direction: column;
  margin: 75px auto;
}

/* Features container styling */
.home-test .step-test {
  display: flex;
  justify-content: space-between;
  column-gap: 50px;
  width: 85%;
  margin: auto;
}

/* CTA button styling */
.home-test-btn {
  width: 250px;
  padding: 10px;
  margin-top: 20px;
  background-color: var(--controls-color);
  border-radius: 10px;
  font-size: 20px;
}

/* User reviews section styling */
.home-user-review {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(to bottom right, var(--main-color), var(--secondary-color));
  padding: 50px 0;
  margin-top: 30px;
}

.home-user-review span , .home-user-review .comments-link{
  color: var(--controls-color);

  font-weight: 500;
  font-family: 'Montserrat Alternates', sans-serif;
  text-shadow: 2px 2px 1px rgba(22, 23, 25, 0.2);

}


.home-user-review span{
  margin-bottom: 50px;
  font-size: 24px;
}

/* User reviews title styling */
.home-user-review .comments-link {
  margin-top: 50px;
  font-size: 18px;

}

/* User reviews list container styling */
.home-user-review .user-list {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

/* Individual user card styling */
.home-user-review .user-list .user-card {
  margin: 0 25px;
}

/* Comment section container styling */
.home-user-comment {
  display: flex;
  align-items: center;
  width: 50%;
  height: 300px;
  margin: 75px auto;
  border: 1px solid rgba(22, 23, 25, 0.4);
  border-radius: 15px;
  justify-content: space-evenly;
  box-shadow: 1px 1px 2px var(--text-color);
}
/* Comment section image styling */
.home-user-comment img {
  width: 250px;
  margin: 0;
}

/*comment dealy */
.placeholder {
  width: 200px;
  height: 300px;
  background-color: var(--background-color);
  border: none;
  border-radius: 20px;
  box-sizing: border-box;
}

.placeholder .placeholder-image{
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--placeholder-background);
  margin: 25px auto;
}

.placeholder .placeholder-line{
  width: 60%;
  height: 3px;
  background-color: var(--placeholder-background);
  margin: auto;
}

.placeholder .placeholder-content{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 35px 0;
  gap: 15px;
}

.placeholder .placeholder-content .one{
  width: 70%;
  height: 30px;
  background-color: var(--placeholder-background);
}

.placeholder .placeholder-content .two{
  width: 50%;
  height: 30px;
  background-color: var(--placeholder-background);
}

/* Comment form container styling */
.home-user-comment .user-comment {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Comment section title styling */
.home-user-comment .user-comment span {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 22px;
  text-align: center;
  font-weight: bold;
  color: var(--controls-color);
  /* -webkit-text-stroke: 0.5px var(--text-color); */
  margin-bottom: 25px;
}

/* Comment input field styling */
.home-user-comment .user-comment input {
  border: none;
  border-radius: 20px;
  text-align: center;
  box-shadow: 1px 1px 2px 1px rgba(22, 23, 25, 0.4);
  padding: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  height: 40px;
}

/* Comment submit button styling */
.home-user-comment .user-comment .comment-btn {
  background-color: var(--controls-color);
  border-radius: 8px;
}

@media (max-width: 1199px) {
  .home-intro {
    width: 100%;
    justify-content: center;
    margin: 25px auto;
  }

  .home-description {
    width: 80%;
  }

  .home-img {
    display: none;
  }

  .home-description .title {
    font-size: 36px;
    margin-bottom: 15px;
  }

  .home-description .sub-title {
    text-align: center;
    font-size: 30px;
  }

  .home-description p {
    font-size: 18px;
  }

  .home-description .search-part {
    width: 50%;
  }

  .home-description .search-part .input-search {
    padding: 10px;
    margin: 20px 0;
    font-size: 18px;
  }

  .home-description .search-part .input-search::placeholder {
    font-size: 16px;
  }


  .placeholder {
    width: 100%;
    height: 75px;
    display: flex;
    flex-direction: row;
    align-items: center;

    column-gap: 15px;
  }

  .placeholder .placeholder-image{
    width: 30px;
    height: 30px;
    margin: 0 10px;
    box-sizing: border-box;
  }

  .placeholder .placeholder-line{
    display: none;
    width: 0;

  }

  .placeholder .placeholder-content{
    /* background-color: red; */
    width: 70%;
    height: 45px;
    padding: 10px;
    align-items: start;
    /* gap: 5px; */
  }
  .placeholder .placeholder-content .one{
    width: 20%;
  }

  .home-test {
    width: 50%;
    padding: 5% 0;
    border-radius: 10px;
    box-shadow: 1px 2px 4px 0 var(--text-color);
    background-color: var(--elements-color);
    margin: 25px auto;
  }

  .home-test .step-test {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }

  .home-test-btn {
    width: 150px;
    padding: 5px;
    border-radius: 5px;
    font-size: 16px;
  }

  .home-user-review .comments-link {
    font-size: 14px;
  }

  .home-user-review .user-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .home-user-comment {
    width: 100%;
    height: 200px;
    border: none;
    box-shadow: none;
    margin: 25px auto;
  }

  .home-user-comment img {
    display: none;
  }

  .home-user-comment .user-comment {
    align-items: center;
    width: 100%;
  }

  .home-user-comment .user-comment span {
    font-size: 18px;
    margin-bottom: 0;
  }

  .home-user-comment .user-comment input {
    width: 50%;
  }

  .home-user-comment .user-comment .comment-btn {
    border-radius: 5px;
  }
}

@media (max-width: 767px) {
  .home-description .title {
    font-size: 30px;
  }

  .home-description .sub-title {
    font-size: 18px;
  }

  .home-description p {
    font-size: 12px;
  }

  .home-description .search-part {
    width: 70%;
  }

  .home-description .search-part .input-search {
    font-size: 12px;
    height: 30px;
    margin: 10px auto;
  }

  .home-description .search-part .input-search::placeholder {
    font-size: 10px;
  }

  .home-test {
    width: 50%;
    margin: 0 auto;
  }

  .home-test-btn {
    font-size: 10px;
    width: 125px;
    margin-top: 10px;
  }

  .home-user-review span{
  font-size: 16px;
  }

  .home-user-review .comments-link {
    font-size: 12px;
  }

  .home-user-comment .user-comment span {
    font-size: 18px;
  }

  .home-user-comment .user-comment .comment-btn {
    font-size: 14px;
    width: 100px;
  }

  .placeholder .placeholder-content .one{
    width: 35%;
  }

  .placeholder .placeholder-content .two{
    width: 100%;
  }
}

@media(max-width:360px){
  .home-test {
    width: 80%;
    margin: 0 auto;
  }

  .home-test-btn {
    font-size: 10px;
    width: 100px;
    margin-top: 10px;
  }

}

/* Change input default border color on focus */
* input {
  box-sizing: border-box;
  outline: none;
  font-family: 'Montserrat', sans-serif;
}

* input:focus {
  box-shadow: none !important;
  border: 2px solid var(--main-color) !important;
  caret-color: var(--main-color);
}

button {
  width: fit-content;
  margin: auto;
}
</style>
