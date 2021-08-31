import axios from 'axios';
// window.API_DOMAIN = 'http://127.0.0.1:8000';
window.API_DOMAIN = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:8000';
window.SERVER_DOMAIN = process.env.NODE_ENV === 'production' ? '/backend' : 'http://127.0.0.1:3000';
// GET跟Filter爬蟲文章
const all_craw_article = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/searcharticles/`
});

// GET 關鍵字搜尋網路文章
const searchbar_article = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/searchbar/article/`
});

//GET 透過核對userEmail資料，取出指定userMoreDetail
const searchbar_user_email = axios.create({
  baseURL:`${API_DOMAIN}/apiserver/searchuser_data/backend/`
});

//GET 所有會員資料(size=、page=)
const searchbar_user = axios.create({
  baseURL:`${API_DOMAIN}/apiserver/usersearchbar/backend/`
});

//GET 所有民眾資料
const user_data_list = axios.create({
  baseURL:`${API_DOMAIN}/apiserver/user_data_list?size=5`
});

//GET 所有醫師資料
const doctor_data_list = axios.create({
  baseURL:`${API_DOMAIN}/apiserver/doct_data_list?size=5`
});

// GET resumeSearch&resume
const search_resume_detail= axios.create({
  baseURL: `${API_DOMAIN}/apiserver/searchresume/detail/`
});

//GET 搜尋故事卡
const searchbar_resume = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/searchbar/resume/`
});

//GET 發送信箱驗證碼
const send_mail = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/send_mail/`
});

//GET 立即驗證用戶
const user_verified = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/user_verified/`
});

//GET 更新網路文章時間
const article_update_timeGap = axios.create({
  baseURL: `${API_DOMAIN}/article/update_timeGap`
});

//GET 用戶停權
const user_suspended = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/user_suspended/`
});

//GET 修改會員為已讀取 // DELETE 重置全體會員讀取
const user_read= axios.create({
  baseURL: `${API_DOMAIN}/apiserver/user_read/`
});

// GET Server當前時間
const time_now = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/get_time`,
});

//GET 單獨發送最新EDM
const send_one_mail = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/send_one_mail/`
})


// --------------------------------------------------------//


//PUT 修改會員資料(一般)
const update_user_profile = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/update/user_profile/`
});

//PUT 修改會員資料(醫師)
const update_doctor_profile = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/update/doct_profile/`
});

//PUT 取得更多故事卡資訊內容及修改
const resume_load = axios.create({
  baseURL:`${API_DOMAIN}/apiserver/resume_load`
});

//PUT 取得祝福牆內容
const resume_bless = axios.create({
  baseURL:`${API_DOMAIN}/apiserver/resume_bless`
});

// PUT 忘記密碼寄送至信箱中 會員＆登入後台使用
const give_pass_mail = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/give_pass/`
});

//PUT 登入判斷是否為管理員身份
const backend_login = axios.create({
  baseURL: `${API_DOMAIN}/backend/login`
});

//PUT 編輯故事卡基本資料
const update_status = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume/backend/update_status`
});

//PUT 編輯故事卡心靈正能量
const update_newlife = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume/backend/update_newlife`
});

//PUT 編輯故事卡確診與發現
const update_detect = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume/backend/update_detect`
});

//PUT 編輯故事卡抗癌治療治療心得
const update_cure = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume/backend/update_cure`
});

//PUT 編輯故事卡藥物資訊
const update_drug = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume/backend/update_drug`
});

//PUT 編輯故事卡看診經驗
const update_diagnose = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume/backend/update_diagnose`
});

//PUT 新增文章縮圖
const scoop_thumb_upload = axios.create({
  baseURL: `${API_DOMAIN}/backend/scoop/controll_status`
});

//PUT 新增段落圖片
const scoop_info_upload = axios.create({
  baseURL: `${API_DOMAIN}/backend/scoop/controll_block`
});


// --------------------------------------------------------//
//POST 新增藥物
const post_drug = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume/backend/update_drug`
});

//POST 新增故事卡
const resume_outline = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume_outline`
});

// --------------------------------------------------------//
//DELETE 刪除藥物
const delete_drug = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume/backend/update_drug`
});

// DELETE 刪除藥物
const delete_resume = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/resume_outline`
});


// # ================================================================
// # |                      後台 獨家專欄                             |
// # ================================================================
//PUT 取得所有獨家專欄(tag、size、page)
const search_scoop_merge = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/searchscoop/merge/`
});
// # ================================================================


//GET 取得獨家專欄基本資料(pk)
const load_status = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/scoop/load_status/`
});

//GET 取得獨家專欄內文(pk)
const load_content = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/scoop/load_content/`
});

//GET 取得獨家專欄出處(pk)
const load_origin = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/scoop/load_origin/`
});
//PUT、POST、DELETE 文章基本資料
const scoop_status = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/scoop/backend/controll_status`
});
//PUT、POST、DELETE 文章內文
const scoop_info = axios.create({
  
  baseURL: `${API_DOMAIN}/apiserver/scoop/backend/controll_block`
});
//PUT、POST、DELETE 文章出處
const scoop_origin = axios.create({
  baseURL: `${API_DOMAIN}/apiserver/scoop/backend/controll_origin`
});

// --------------------------------------------------------//
//login
export const putBackend_login = (path, data) => backend_login.put(path,data);
export const deleteBackend_login = (path, config) => backend_login.delete(path, config);

//article
export const getAll_craw_article = (path) => all_craw_article.get(path);
export const getSearchbar_article = (path) => searchbar_article.get(path)

//user
export const getSend_one_mail = (path) => send_one_mail.get(path);
export const putGive_pass_mail = (path, data) => give_pass_mail.put(path, data);
export const getSearchbar_user_email = (path) => searchbar_user_email.get(path);
export const getSearchbar_user = (path) => searchbar_user.get(path);
export const getUser_data_list = (path) => user_data_list.get(path);
export const getDoctor_data_list = (path) => doctor_data_list.get(path);
export const getSend_mail = (path) => send_mail.get(path);
export const getUser_verified = (path) => user_verified.get(path);
export const getUser_suspended = (path) => user_suspended.get(path);
export const putUpdate_user_profile = (path, data) => update_user_profile.put(path, data);
export const putUpdate_doctor_profile = (path, data) => update_doctor_profile.put(path, data);

//resume
export const getSearch_resume_detail = (path, config) => search_resume_detail.get(path, config);
export const getSearchbar_resume = (path, config) => searchbar_resume.get(path, config);
export const putResume_load = (path, data) => resume_load.put(path, data);
export const purResume_bless = (path, data) => resume_bless.put(path, data);
export const putUpdate_status = (path, data) => update_status.put(path, data);
export const putUpdate_newlife = (path, data) => update_newlife.put(path, data);
export const putUpdate_detect = (path, data) => update_detect.put(path, data);
export const putUpdate_cure = (path, data) => update_cure.put(path, data);
export const putUpdate_drug = (path, data) => update_drug.put(path, data);
export const putUpdate_diagnose = (path, data) => update_diagnose.put(path, data);
export const postResume_outline = (path, data) => resume_outline.post(path, data);
export const postUpdate_drug = (path, data) => post_drug.post(path, data);
export const deleteUpdate_drug = (path, config) => delete_drug.delete(path, config);
export const deleteUpdate_resume = (path, config) => delete_resume.delete(path, config);

//autoFunction
export const getArticle_update_timeGap = (path) => article_update_timeGap.get(path);
export const getUser_read = (path) => user_read.get(path);
export const deleteUser_read = (path) => user_read.delete(path);

//scoop
export const putSearch_scoop_merge = (path, data, config) => search_scoop_merge.put(path, data, config);
export const getLoad_status = (path) => load_status.get(path);
export const getLoad_content = (path) => load_content.get(path);
export const getLoad_origin = (path) => load_origin.get(path);
export const getTime_now = (path) => time_now.get(path);

export const putScoop_status = (path, data) => scoop_status.put(path, data);
export const postScoop_status = (path, data) => scoop_status.post(path, data);
export const deleteScoop_status = (path, config) => scoop_status.delete(path, config);


export const putScoop_info = (path, data) => scoop_info.put(path, data);
export const postScoop_info = (path, data) => scoop_info.post(path, data);
export const deleteScoop_info = (path, config) => scoop_info.delete(path, config);

export const putScoop_origin = (path, data) => scoop_origin.put(path, data);
export const postScoop_origin = (path, data) => scoop_origin.post(path, data);
export const deleteScoop_origin = (path, config) => scoop_origin.delete(path, config);

export const putScoop_status_upload = (path, data, config) => scoop_thumb_upload.put(path, data, config);
export const putScoop_info_upload = (path, data, config) => scoop_info_upload.put(path, data, config);
//刪除縮圖
export const deleteScoop_thumb_upload = (path, config) => scoop_thumb_upload.delete(path, config);
//刪除下方圖片
export const getScoop_info_upload = (path) => scoop_info_upload.get(path);
//刪除上方圖片
export const deleteScoop_info_upload = (path, config) => scoop_info_upload.delete(path, config);
