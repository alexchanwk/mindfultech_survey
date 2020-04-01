import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import config from "../config";
import { faUserMd, faHeartbeat, faComment, faChartBar, faClipboardList } from '@fortawesome/free-solid-svg-icons'

class Survey extends Component {

  state = {
    uuid: null,
    report: null,
    error: null,
    validationErrors: null
  }

  chartStyles = {
    anxiety: { backgroundColor: '#e29090' },
    memory: { backgroundColor: '#66a266' },
    insomnia: { backgroundColor: '#b5b515' },
    confidence: { backgroundColor: '#945894' },
    loneliness: { backgroundColor: '#6f6fb1' },
    depression: { backgroundColor: '#888888' },
    active: { backgroundColor: '#ad7a1d' },
    pressure: { backgroundColor: '#9c3a3a' }
  }

  componentDidMount() {
    this.refreshResponse();
  }

  handleValidation = (data) => {
    var validationFailedErrors = [];
    var questionKeys = [];
    for (var i=1; i<=20; i++) {
      questionKeys.push("q" + i);
    }
    data.forEach((value, key) => {
      if (key === "name" && !value) {
        validationFailedErrors.push("請填寫你的「姓名」");
      }
      if (key === "email") {
        if ( !value ) {
          validationFailedErrors.push("請填寫你的「電郵」");
        } else if (! value.match(/^.+@.+\..+$/g)) {
          validationFailedErrors.push("請填寫正確的「電郵」");
        }
      }
      if (key.match(/^q[0-9]+$/g) && value) {
        questionKeys.splice(questionKeys.indexOf(key), 1)
      }
    });
    if (questionKeys.length > 0) {
      validationFailedErrors.push("請回答全部20條問題");
    }
    this.setState({ validationErrors: validationFailedErrors });
    return (validationFailedErrors.length === 0);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    if (this.handleValidation(data)) {
      fetch(config.scriptURL, { method: 'POST', body: data })
        .then(response => response.json())
        .then((data) => {
          if (data.id) {
            this.setState({ uuid: data.id });
            this.refreshResponse();
          }
        })
        .catch(error => console.error('Error!', error.message))
    } else {
      window.scrollTo(0, 0)
    }
  }

  refreshResponse() {
    if (this.state.uuid) {
      fetch(config.scriptURL + "?" + new URLSearchParams({
        id: this.state.uuid
      }), { method: 'GET' })
        .then(res => res.json())
        .then((data) => {
          this.setState({ report: data.report })
        })
        .catch(console.log);
    }
  }

  renderQuestions = () => {
    var validationErrors = null;
    if (this.state.validationErrors && this.state.validationErrors.length > 0) {
      validationErrors = this.state.validationErrors.map((validationError, i) => {
        return (
          <p key={i} className="error-message">
            {validationError}
          </p>
        )
      });
    }
    const profileInputs = Object.keys(config.profile).map((p) => {
      return (
        <li key={p}>
          <label htmlFor={p} className="mandatory">{config.profile[p]}</label>
          <input
            type="text"
            id={p}
            name={p}
          />
        </li>
      )
    });
    const questionInputs = Object.keys(config.questions).map((q) => {
      return (
        <li key={q}>
          <p>{config.questions[q]}</p>
          <ul className="choice" >
            {
              Object.keys(config.options).map((option, i) => {
                return (
                  <li key={i}>
                    <input
                      type="radio"
                      id={q + "_" + option}
                      className={option}
                      name={q}
                      value={option}
                    />
                    <label htmlFor={q + "_" + option}>{config.options[option]}</label>
                  </li>
                )
              })
            }
          </ul>
        </li>
      )
    });
    return (
      <form name="survey" className="survey_form" onSubmit={this.handleSubmit}>
        <h1>
          <span className="icon">
            <FontAwesomeIcon icon={faClipboardList} />
          </span>
          SMART ❤ 情緒指數測試
        </h1>
        {validationErrors}
        <fieldset className="section">
          <legend className="title">聯絡資料</legend>
          <ol>
            {profileInputs}
          </ol>
        </fieldset>
        <fieldset className="section">
          <legend className="title mandatory">在過去的兩個星期，你有多經常受以下問題困擾?</legend>
          <ol>
            {questionInputs}
          </ol>
        </fieldset>
        <div>
          <button className="submit" type="submit">查看結果</button>
        </div>
      </form>
    )
  }

  renderResults = () => {
    if (this.state.uuid && this.state.report) {
      const report = this.state.report;
      this.chartStyles.anxiety.width = report.indices.anxiety * 0.8 + '%';
      this.chartStyles.memory.width = report.indices.memory * 0.8 + '%';
      this.chartStyles.insomnia.width = report.indices.insomnia * 0.8 + '%';
      this.chartStyles.confidence.width = report.indices.confidence * 0.8 + '%';
      this.chartStyles.loneliness.width = report.indices.loneliness * 0.8 + '%';
      this.chartStyles.depression.width = report.indices.depression * 0.8 + '%';
      this.chartStyles.active.width = report.indices.active * 0.8 + '%';
      this.chartStyles.pressure.width = report.indices.pressure * 0.8 + '%';
      return (
        <div className="survey_report">
          <h1>
            <span className="icon">
              <FontAwesomeIcon icon={faUserMd} />
            </span>
            經 SMART ❤ 評估
          </h1>
          <fieldset className="section">
            <legend>
              <span className="icon category_icon">
                <FontAwesomeIcon icon={faHeartbeat} />
              </span>
            </legend>
            <p className="title">
              風險類別
            </p>
            <p>{report.category}</p>
          </fieldset>
          <fieldset className="section">
            <legend>
              <span className="icon comment_icon">
                <FontAwesomeIcon icon={faComment} />
              </span>
            </legend>
            <p className="title">溫馨提示</p>
            <ul className="comments">
            {
              report.comments.map((comment, i) => {
                return <li key={i}>{comment}</li>
              })
            }
            </ul>
          </fieldset>
          <fieldset className="section">
            <legend>
              <span className="icon indices_icon">
                <FontAwesomeIcon icon={faChartBar} />
              </span>
            </legend>
            <p>
              <span className="title">
                綜合情緒指數
              </span>
            </p>
            <ul className="indices">
              <li>焦慮：
                <div class="bar" style={this.chartStyles.anxiety}>&nbsp;</div>&nbsp;{report.indices.anxiety}%
              </li>
              <li>記憶：
                <div class="bar" style={this.chartStyles.memory}>&nbsp;</div>&nbsp;{report.indices.memory}%
              </li>
              <li>失眠：
                <div class="bar" style={this.chartStyles.insomnia}>&nbsp;</div>&nbsp;{report.indices.insomnia}%
              </li>
              <li>自信：
                <div class="bar" style={this.chartStyles.confidence}>&nbsp;</div>&nbsp;{report.indices.confidence}%
              </li>
              <li>孤獨：
                <div class="bar" style={this.chartStyles.loneliness}>&nbsp;</div>&nbsp;{report.indices.loneliness}%
              </li>
              <li>抑鬱：
                <div class="bar" style={this.chartStyles.depression}>&nbsp;</div>&nbsp;{report.indices.depression}%
              </li>
              <li>活躍：
                <div class="bar" style={this.chartStyles.active}>&nbsp;</div>&nbsp;{report.indices.active}%
              </li>
              <li>壓力：
                <div class="bar" style={this.chartStyles.pressure}>&nbsp;</div>&nbsp;{report.indices.pressure}%
              </li>
            </ul>
          </fieldset>
          <fieldset className="section">
            <legend className="title">SMART ❤ 專屬互動課程</legend>
            <p>唔使等，比出面睇醫生或者周圍揾人幫手方便好多！</p>
            <p>自己做選擇，隨心所想！</p>
            <a href="#" className="submit">開始探索</a>
            <p></p>
          </fieldset>
        </div>
      )
    }
    return (
      <h2>評估中...</h2>
    )
  }

  render() {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
    if (this.state.uuid) {
      return this.renderResults();
    }
    return this.renderQuestions();
  }
}
export default Survey;