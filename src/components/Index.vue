<template>
  <el-col style="background-color:#eee;" v-loading="loading">
    <el-col class="vote-head" :md="{span:24}" :xs="{span:24}">
      <p v-text="config.configTitle"></p>
    </el-col>
    <el-col :md="{span:12,offset:6}" :xs="{span:24}">
      <el-col class="vote-introduce" :xs="{span:24}" :md="{span:24}">
        <el-col class="vote-img">
          <img :src="config.configUrlImg" class="vote-config-img" alt="">
        </el-col>
        <el-col class="vote-introduce-text">
          <div v-html="config.configIntroduce" style="padding: 10px 0;">
          </div>
        </el-col>
      </el-col>
    </el-col>
    <el-col class="vote-body" :md="{span:24}" :xs="{span:24}">
      <el-col class="vote-form" :md="{span:12,offset:6}" :xs="{span:24}">
        <el-col class="teacherGroup">
          <el-col class="teacher-item" v-for="(teacher,index) in teachers" :key="index">
            <el-col class="teacher-img" :md="{span:8}" :xs="{span:24}">
              <img class="teacher-item-img" :src="teacher.teacherImgUrl" alt="">
              <!--              <img class="teacher-item-img" src="../assets/向妙莲.jpg" alt="">-->
            </el-col>
            <el-col class="teacher-text" :md="{span:15,offset:1}" :xs="{span:24}">
              <el-col class="teacherName">
                <h2>
                  <span v-text="teacher.teacherDepartment"></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span v-text="teacher.teacherName"></span>
                </h2>
              </el-col>
              <el-col class="teacherDesc" :md="{span:24}" :xs="{span:24}">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span v-text="teacher.teacherDesc"></span>
              </el-col>
            </el-col>
          </el-col>
        </el-col>


        <!--展示确定选择票数的对话框-->
        <el-col class="vote-form-body" id="bottomVote" v-show="!showTeacherData">
          <el-col class="vote-form-head">
            <el-col class="vote-form-head-text">
              每位投票者只有一次投票机会，每位投票者可以投2-10位候选者，每位候选者最多1票，最少0票。
              <div style="text-align: right;font-size: 12px;">
                （排名不分先后，按学院顺序进行排序）
              </div>
            </el-col>
          </el-col>
          <!--老师的按钮部分-->
          <el-col class="buttonGroup">
            <el-col class="vote-teacher-item" :xs="{span:6}" :md="{span:6}" :sm="{span:6}" v-for="(teacher,index) in  teachers"
                    :key="index">
              <button :id="'button'+index" @click="voteChange(index)">
                <span v-text="teacher.teacherName"></span>
              </button>
            </el-col>
          </el-col>
          <el-col style="text-align: center;border-top:solid 1px #ccc;margin-top: 15px;">
            <el-button class="button" type="primary" @click="checkChoose">提交我的选择</el-button>
          </el-col>
        </el-col>


        <!--展示每个老师的票数的部分-->
        <el-col :md="{span:24}" :xs="{span:24}">
          <el-col v-show="showTeacherData" class="teacherDataTable" :xs="{span:24}" :sm="{span:23}" :md="{span:23}">
            <el-col v-for="(teacher,index) in teacherData" :key="index" class="teacherCountPro" :xs="{span:24}" :sm="{span:24}" :md="{span:24}">
              <el-col :md="{span:6}" :xs="{span:5}" :sm="{span:6}" v-text="teacher.teacherName"></el-col>
              <el-col :md="{span:16}" :xs="{span:14}" :sm="{span:15}" >
                <el-progress :show-text="false" :stroke-width="26" :color="colorArray[index % colorArray.length]"
                             :percentage="teacher.teacherCount / teacherCountSum * 100"></el-progress>
              </el-col>
              <el-col :md="{span:2}" :xs="{span:5}" :sm="{span:3}">
                &nbsp;<span v-text="teacher.teacherCount + '票'"></span>
              </el-col>
            </el-col>
          </el-col>
        </el-col>


      </el-col>
    </el-col>

    <!--    登录对话框-->
    <el-col :xs="{span:24}" :md="{span:12,offset:6}">
      <el-dialog
        title="登录"
        :visible.sync="showLogin"
        v-loading="loading"
        :show-close="false"
        :width="getDialogWidth()"
        :close-on-click-modal="false"
        :center="true"
        class="dialog">
        <el-col class="form">
          <el-form :model="user" :rules="rules" ref="ruleForm" label-width="60px">
            <el-form-item label="账号" prop="userId">
              <el-input v-model="user.userId" placeholder="教务处账号(学生不加60,老师不加00000)"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
              <el-input type="password" v-model="user.userPassword" placeholder="输入教务管理系统密码"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showLogin = false">取 消</el-button>
          <el-button type="primary" @click="checkForm">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="确定提交"
        v-loading="submitLoading"
        :visible.sync="showChooseRes"
        :width="getDialogWidth()"
        :show-close="false"
        :close-on-click-modal="false"
        :center="true"
        class="dialog">
        <div slot="footer" class="dialog-footer">
          <el-button @click="newChoose">重新选择</el-button>
          <el-button type="primary" @click="submitChoose">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>


    <el-col>
      <div class="goBottom" @click="goBottom">
        <span>点我投票</span>
      </div>
    </el-col>

    <!--页面尾部信息栏-->
    <el-col :md="{span:24}" :xs="{span:24}" class="vote-footer">
      版权所有
      <a data-v-07482e07=""
         href="https://baike.baidu.com/item/%E6%B1%9F%E8%A5%BF%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E8%BD%AF%E4%BB%B6%E5%AD%A6%E9%99%A2%E9%9D%92%E8%97%A4%E5%B7%A5%E4%BD%9C%E5%AE%A4"
         target="_blank" style="color: rgb(204, 204, 204);">江西农业大学软件学院青藤工作室</a>
      ©青藤设计
    </el-col>

  </el-col>
</template>

<script>
  const axios = require('axios');
  const qs = require("qs");
  export default {
    name: "Index",
    data() {
      return {
        teachers: [],//老师信息数组
        chooseTeacher: [], //选择的老师下标
        voteArray: [], //选择的票数
        showLogin: false, //是否显示登录框
        user: { //学生登录对象
          userId: '',
          userPassword: ''
        },
        rules: { //登录信息校验规则
          userId: [
            {required: true, message: '请输入教务处账号(学生不加60,老师不加00000)', trigger: 'blur'},
            {min: 4, max: 20, message: '长度在 4 到 20 位数字', trigger: 'blur'}
          ],
          userPassword: [
            {required: true, message: '请输入教务管理系统密码', trigger: 'blur'},
            {min: 4, max: 30, message: '长度在 4 到 30 位数字', trigger: 'blur'}
          ]
        },
        loading: false, //加载loading
        config: {}, //配置信息
        dialogWidth: "90%", //dialog的默认宽度
        showChooseRes: false, //展示选择的结果
        submitLoading: false, //显示提交的loading
        teacherData: [],// 老师的投票数据
        showTeacherData: false, //展示老师数据的部分
        colorArray: [
          '#f56c6c',
          '#e6a23c',
          '#5cb87a',
          '#1989fa',
          '#6f7ad3'
        ],
        teacherCountSum: 100,
      }
    },
    methods: {
      loadAllTeacher() {  //加载全部老师的信息
        this.loading = true;
        axios.get(this.$URL.teacherDesc, {}).then((success) => {
          let res = success.data;
          if (res.result) {
            this.teachers = res.data;
            for (let t in res.data) {
              this.chooseTeacher.push(t.teacherId);
              this.voteArray.push(0);
            }
          }
          this.loading = false;
        }).catch((error) => {
          console.log(error);
          this.$message({
            type: "warning",
            message: "请求异常"
          });
        });
      },
      voteChange(index) {//投票的改变事件
        let voteTotal = 0;
        this.voteArray[index] = 1 - this.voteArray[index];
        if (this.voteArray[index] === 1) {
          document.getElementById("button" + index).style.backgroundColor = "#409EFF";
        } else {
          document.getElementById("button" + index).style.backgroundColor = "#fff";
        }
        for (let i of this.voteArray) {
          voteTotal += i;
          if (voteTotal > this.config.configMaxVoteCount) {
            this.$message({
              type: "warning",
              message: "你选择的老师数已超过 " + this.config.configMaxVoteCount + "位"
            });
            return;
          }
        }
      },
      checkChoose() {//检查我的选择
        this.loading = true;
        //统计票数
        let voteTotal = 0;
        for (let i of this.voteArray) {
          voteTotal += i;
          if (voteTotal > this.config.configMaxVoteCount) {
            this.$message({
              type: "warning",
              message: "你选择的候选者数量已超过 " + this.config.configMaxVoteCount + " 位,请重新选择！"
            });
            this.loading = false;
            return;
          }
        }
        if (voteTotal < this.config.configMinVoteCount) {
          this.$message({
            type: "warning",
            message: "最少选择 " + this.config.configMinVoteCount + " 位候选者"
          });
          this.loading = false;
          return;
        }
        //显示登录框
        this.loading = false;
        this.showLogin = true;
      },
      submitChoose() {//提交我的选择
        this.submitLoading = true;
        //封装对象 进行二次校验  计算选取的总票数
        let voteTotal = 0;
        for (let i of this.voteArray) {
          voteTotal += i;
          if (voteTotal > this.config.configMaxVoteCount) {
            this.$message({
              type: "warning",
              message: "你选择的候选者数量已超过 " + this.config.configMaxVoteCount + "位,请重新选择！"
            });
            this.loading = false;
            return;
          }
        }
        if (voteTotal < this.config.configMinVoteCount) {
          this.$message({
            type: "warning",
            message: "最少选择" + this.config.configMinVoteCount + "位候选者"
          });
          this.loading = false;
          return;
        }
        //清除0票选手
        let voteArrayTemp = [];
        let chooseArrayTemp = [];
        for (let voteIndex in this.voteArray) {
          if (this.voteArray[voteIndex] !== 0) {
            voteArrayTemp.push(this.voteArray[voteIndex]);
            chooseArrayTemp.push(this.teachers[voteIndex].teacherId);
          }
        }
        //开始提交
        axios.post(this.$URL.userVote, qs.stringify({
            userId: this.user.userId,
            userPassword: this.user.userPassword,
            chooseIdArray: chooseArrayTemp,
            voteArray: voteArrayTemp
          },
          {indices: false}
        )).then((success) => {
          let res = success.data;
          if (res.result) {
            this.loadAllTeacherData();
            this.$message({
              type: "success",
              message: res.message
            });
            this.chooseTeacher = [];
            this.showLogin = false;
            this.showChooseRes = false;
            //清空计数器
            for (let index in this.voteArray) {
              this.voteArray[index] = 0;
            }
            //重置密码信息
            this.user = {
              userId: "",
              userPassword: ""
            };
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
            if(res.message === "亲，你已经投过票了！"){
              this.loadAllTeacherData();
            }
            this.showLogin = false;
            this.user.userPassword = "";
            this.showChooseRes = false;
          }
          this.submitLoading = false;
        }).catch((error) => {
          console.log(error);
          this.$message({
            type: "warning",
            message: "请求异常"
          });
          this.submitLoading = false;
        });
      },
      checkForm() {//检查登录表单
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.showChooseRes = true;
          } else {
            this.$message({
              type: "warning",
              message: "您输入的信息不合法"
            });
          }
        });
      },
      loadConfig() {//加载系统配置信息
        axios.get(this.$URL.config, {}).then((success) => {
          let res = success.data;
          if (res.result) {
            this.config = res.data;
          } else {
            this.$message({
              type: "warning",
              message: "暂无数据"
            })
          }
        }).catch((error) => {
          console.log(error);
          this.$message({
            type: "warning",
            message: "请求异常"
          });
        });
      },
      newChoose() {//重新选择出发事件
        this.loading = false;
        this.showChooseRes = false;
        this.showLogin = false;
        this.user = {
          userId: '',
          userPassword: ''
        };
      },
      loadAllTeacherData() {//加载全部老师的投票数据
        this.loading = true;
        axios.get(this.$URL.teacherData, {}).then((success) => {
          let res = success.data;
          if (res.result) {
            this.teacherData = res.data;
            this.showTeacherData = true;
            this.teacherCountSum = 0;
            for(let teacher of this.teacherData){
              this.teacherCountSum += teacher.teacherCount;
            }
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
          this.loading = false;
        }).catch((error) => {
          console.log(error);
          this.$message({
            type: "error",
            message: "网络错误"
          });
          this.loading = false;
        })
      },
      getDialogWidth() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? "90%" : "30%";
      },
      goBottom() {
        let t = document.body.scrollHeight;
        window.scroll({top: t - 650, left: 0, behavior: 'smooth'});
      }
    },
    created() {
      this.loadAllTeacher();
      this.loadConfig();
      //判断移动端还是手机端
      // this.loadAllTeacherData();
    }
  }
</script>

<style scoped>
  .vote-head {
    text-align: center;
    font-size: 28px;
    background-color: #303133;
    color: white;
    line-height: 30px;
    word-spacing: 3px;
  }

  .vote-introduce {
    text-align: left;
    background-color: #fff;
  }

  .vote-introduce-text {
    padding: 0 25px;
    font-size: 20px;
  }

  .vote-body {
    background-color: #eee;
  }

  .vote-form {
    background-color: #fff;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .vote-form-body {
    text-align: left;
    width: 90%;
    margin: 0 5% 20px 5%;
    border: solid 1px #ccc;
  }

  .vote-form-head {
    border-bottom: solid 1px #ccc;
  }

  .vote-form-head-text {
    padding: 0 8px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: red;
  }

  .buttonGroup {
    padding-top: 15px;
  }

  .vote-teacher-item {
    line-height: 50px;
    text-align: center;
  }

  .vote-teacher-item button {
    height: 40px;
    width: 80px;
    background-color: #fff;
    border: solid 1px #ccc;
    border-radius: 5px;
    outline: none;
  }

  .button {
    width: 90%;
    margin: 15px 0;
  }

  .teacher-item {
    padding: 0 15px 10px 15px;
    margin: 10px 0;
    border-bottom: solid 1px #ccc;
  }

  .teacherName {
    text-align: left;
    line-height: 30px;
  }

  .teacherDesc {
    text-align: left;
    corlor: black;
    line-height: 25px;
    min-height: 100px;
    font-size: 16px;
  }

  .dialog {
    text-align: left;
  }

  .teacher-item-img {
    text-align: center;
    width: 100%;
    height: auto;
    padding-top: 5px;
  }


  .dialog-footer {
    text-align: right;
  }

  .teacherDataTable {
    margin-top: 25px;
    text-align: center;
    margin-bottom: 20px;
  }

  .teacherCountPro {
    height: 35px;
  }

  .vote-footer {
    line-height: 70px;
    background-color: #303133;
    font-size: 12px;
    color: white;
  }

  .vote-config-img {
    width: 100%;
    height: auto;
  }

  .goBottom {
    position: fixed;
    border-radius: 50%;
    right: 355px;
    width: 70px;
    height: 70px;
    font-size: 12px;
    line-height: 70px;
    bottom: 150px;
    background-color: #ccc;
    opacity: 0.4;
    cursor: pointer;
  }

  .goBottom span {
    text-decoration: none;
    text-underline: none;
    color: black;
    font-weight: bold;
    word-spacing: 5px;
  }

  @media screen and (max-width: 760px) {
    .vote-head {
      line-height: 50px;
      font-size: 16px;
    }

    .goBottom {
      right: 15px;
      bottom: 50px;
      font-size: 14px;
    }

    .vote-introduce-text {
      padding: 0 10px;
    }

    .vote-form-head-text {
      font-size: 14px;
      text-align: left;
    }

    .resultItemName {
      flex: 0.5;
    }

    .resultItemVoteCount {
      flex: 0.3;
    }

  }
</style>
