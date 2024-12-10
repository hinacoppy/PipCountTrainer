// PipCountTrainer.js
"use strict";

class PipCountTrainer {
  constructor() {
    this.xgid = new Xgid(null);
    this.board = new BgBoard("#board");

    this.setDomNames();
    this.setEventHandler();
    //this.resetAll("XGID=-b----E-C---eE---c-e----B-:0:0:1:12:0:0:0:0:10");
    this.resetAll();

    this.plusminusflag = true; //plus(T), minus(F)
    this.showtimerflag = true; //show(T), hide(F)
    this.whichpip = 0; //(1)=pip1 (2)=pip2 (3)=relative mode
  } //end of constructor()

  setDomNames() {
    //buttons
    this.tenkey      = $(".tenkey");
    this.clearbtn    = $("#clearbtn");
    this.backbtn     = $("#backbtn");
    this.minusbtn    = $("#minusbtn");
    this.okbtn       = $("#okbtn");
    this.nextbtn     = $("#nextbtn");
    this.showtimercb = $("#showtimercb");
    this.boffleft    = $("#boffleft");
    this.boffright   = $("#boffright");
    this.pipbutton   = $("#pip1, #pip2, #pip3");

    //infos
    this.timer   = $("#timer");
    this.pip1    = $("#pip1");
    this.pip2    = $("#pip2");
    this.pip3    = $("#pip3");
    this.pip1ans = $("#pip1ans");
    this.pip2ans = $("#pip2ans");
    this.pip3ans = $("#pip3ans");
  }

  setEventHandler() {
    this.tenkey.     on("click", (e) => { e.preventDefault(); this.tenkeyAction(e.target.id); });
    this.clearbtn.   on("click", (e) => { e.preventDefault(); this.clearAction(); });
    this.backbtn.    on("click", (e) => { e.preventDefault(); this.backAction(); });
    this.minusbtn.   on("click", (e) => { e.preventDefault(); this.plusminusAction(); });
    this.okbtn.      on("click", (e) => { e.preventDefault(); this.okAction(); });
    this.nextbtn.    on("click", (e) => { e.preventDefault(); this.nextAction(); });
    this.showtimercb.on("change",(e) => { e.preventDefault(); this.changetimercbAction(); });
    this.boffleft.   on("click", (e) => { e.preventDefault(); this.flipboardAction(true); });
    this.boffright.  on("click", (e) => { e.preventDefault(); this.flipboardAction(false); });
    this.pip1.       on("click", (e) => { e.preventDefault(); this.pip1SelectAction(); });
    this.pip2.       on("click", (e) => { e.preventDefault(); this.pip2SelectAction(); });
    this.pip3.       on("click", (e) => { e.preventDefault(); this.pip3SelectAction(); });
    $(window).       on("resize",(e) => { e.preventDefault(); this.board.redraw(); });
  }

  resetAll(xgidstr = null) {
    this.xgid = new Xgid(xgidstr);
    this.board.showBoard2(this.xgid);
    this.pip1str = "";
    this.pip1.text("0");
    this.pip1ans.hide();
    this.pip2str = "";
    this.pip2.text("0");
    this.pip2ans.hide();
    this.pip3str = "+";
    this.pip3.text("+0");
    this.pip3ans.hide();
  }

  tenkeyAction(id) {
    const num = id.substring(3);
console.log("tenkeyAction", id, num);
    switch(this.whichpip) {
    case 1:
      this.pip1str += num;
      this.pip1.text(this.pip1str);
      break;
    case 2:
      this.pip2str += num;
      this.pip2.text(this.pip2str);
      break;
    case 3:
      this.pip3str += num;
      this.pip3.text(this.pip3str);
      break;
    }
  }

  clearAction() {
    switch(this.whichpip) {
    case 1:
      this.pip1str = "";
      this.pip1.text("0");
      break;
    case 2:
      this.pip2str = "";
      this.pip2.text("0");
      break;
    case 3:
      this.pip3str = "+";
      this.pip3.text("+0");
      break;
    }
  }

  backAction() {
    let pipstr;
    switch(this.whichpip) {
    case 1:
      this.pip1str = this.pip1str.substring(0, this.pip1str.length -1);
      pipstr = (this.pip1str.length == 0) ? "0" : this.pip1str;
      this.pip1.text(pipstr);
      break;
    case 2:
      this.pip2str = this.pip2str.substring(0, this.pip2str.length -1);
      pipstr = (this.pip2str.length == 0) ? "0" : this.pip2str;
      this.pip2.text(pipstr);
      break;
    case 3:
      if (this.pip3str.length == 1) { break; }
      this.pip3str = this.pip3str.substring(0, this.pip3str.length -1);
      pipstr = (this.pip3str.length == 1) ? this.pip3str + "0" : this.pip3str;
      this.pip3.text(pipstr);
console.log("backAction", this.pip3str, pipstr);
      break;
    }
  }

  plusminusAction() {
    if (this.whichpip != 3) { return; }
    this.plusminusflag = !this.plusminusflag;
    const pm = this.plusminusflag ? "+" : "-";
    this.pip3str = pm + this.pip3str.substring(1);
    const pipstr = (this.pip3str.length == 1) ? this.pip3str + "0" : this.pip3str;
    this.pip3.text(pipstr);
console.log("plusminusAction", this.pip3str, pipstr, pm);
  }

  okAction() {
    this.stopTimer();
    this.showtimer(true);

    const pip1correct = this.xgid.get_pip(1);
    const pip1num = Number(this.pip1str);
    const faclass1 = (pip1num == pip1correct) ? "fa-check green" : "fa-times red";
    const pip1ans = '<i class="fas ' + faclass1 + '"></i> ' + pip1correct
    this.pip1ans.html(pip1ans).show();

    const pip2correct = this.xgid.get_pip(-1);
    const pip2num = Number(this.pip2str);
    const faclass2 = (pip2num == pip2correct) ? "fa-check green" : "fa-times red";
    const pip2ans = '<i class="fas ' + faclass2 + '"></i> ' + pip2correct
    this.pip2ans.html(pip2ans).show();

    const pip3correct = this.xgid.get_pip(1) - this.xgid.get_pip(-1);
    const pip3num = (this.pip3str.length == 1) ? 0 : Number(this.pip3str);
    const faclass3 = (pip3num == pip3correct) ? "fa-check green" : "fa-times red";
    const pip3ans = '<i class="fas ' + faclass3 + '"></i> ' + pip3correct
    this.pip3ans.html(pip3ans).show();
  }

  nextAction() {
    const nextxgid = this.selectXgid();
    this.resetAll(nextxgid);
    this.showtimer(this.showtimerflag)
    this.startTimer();
  }

  changetimercbAction() {
    this.showtimerflag = this.showtimercb.prop("checked");
    this.showtimer(this.showtimerflag)
  }

  showtimer(flag) {
    if (flag) {
      this.timer.removeClass("hidetimer"); //show
    } else {
      this.timer.addClass("hidetimer"); //hide
    }
  }

  flipboardAction(boff) {
    this.board.leftBoffFlag = boff;
    this.board.redraw();
  }

  pip1SelectAction() {
    this.whichpip = 1;
    this.pipbutton.removeClass("selected");
    this.pip1.addClass("selected");
  }

  pip2SelectAction() {
    this.whichpip = 2;
    this.pipbutton.removeClass("selected");
    this.pip2.addClass("selected");
  }

  pip3SelectAction() {
    this.whichpip = 3;
    this.pipbutton.removeClass("selected");
    this.pip3.addClass("selected");
  }

  startTimer() {
    this.frameID = window.requestAnimationFrame(() => { this.countupTimer(); });
    this.clockmilisec = 0;
  }

  stopTimer() {
    window.cancelAnimationFrame(this.frameID);
    this.frameID = undefined; //不要だが分かりやすさのために残しておく
  }

  countupTimer(timestamp) {
    //クロックをFrame Ratio(約16msec)でカウントアップ
    if (this.frameID === undefined) { return; } //クロックが止まっているときは何もしない

    if (timestamp === undefined) {
      this.lasttimestamp = timestamp = performance.now(); //最初に呼ばれたときはリセット
    }

    const elapsed = timestamp - this.lasttimestamp; //前回実行時からの経過時間
    this.lasttimestamp = timestamp;
    this.clockmilisec += elapsed; //表示用(msec)のデータに経過時間を足しこむ
    const clocksec = Math.trunc(this.clockmilisec / 1000); //ミリ秒→秒

    if (this.dispclock != clocksec) { //現在の表示時間と計算で得られた時間が異なれば表示
      this.dispclock = clocksec;
      this.dispTimer(this.dispclock);
    }
    this.frameID = window.requestAnimationFrame((timestamp) => { this.countupTimer(timestamp); });
  }

  dispTimer(time) {
    const min = Math.trunc(time / 60);
    const sec = Math.trunc(time % 60);
    const timestr = ("00" + min).slice(-2) + ":" + ("00" + sec).slice(-2);
    this.timer.text(timestr);
  }

  selectXgid() {
    const xgidlist = this.getXgidlist();
    const rnd = Math.floor(Math.random() * xgidlist.length);
    const selxgid = xgidlist[rnd];
    //ダイス、キューブ、スコアをクリアする
    const position = selxgid.substring(5, 31);
    const nextxgid = "XGID=" + position + ":0:0:1:00:0:0:0:0:10";
    return nextxgid;
  }

  getXgidlist() {
    return [
      "XGID=-b--BBDBBA--a---abbd--c-B-:0:0:1:00:0:0:3:0:10",
      "XGID=a-BBBBB-------A----dBddBb-:1:1:1:00:0:0:3:0:10",
      "XGID=----DBCb-Caa----B-Abacabb-:0:0:1:00:0:0:3:0:10",
      "XGID=aaB-aBE----AcB--Ab-e-bA-A-:0:0:1:00:0:0:3:0:10",
      "XGID=-ab-B-CBC---dC---c-d---aAA:0:0:1:00:0:0:3:0:10",
      "XGID=a--BBCB-B-B---ab-b-d--cbB-:0:0:1:00:23:21:3:0:10",
      "XGID=--B-BaBBB--aaB--bc-cbBb--A:0:0:1:00:4:4:3:0:10",
      "XGID=-a---aEBC---eC---aBdb--a--:0:0:1:00:0:0:3:0:10",
      "XGID=-BAbBBB-BB---A---b-dAbabb-:0:0:1:00:8:11:3:0:10",
      "XGID=-BBBBBCa-----B-a---abbbcc-:0:0:1:00:0:0:3:0:10",
      "XGID=-B-CA-A------------cb-----:1:1:1:00:0:0:3:0:10",
      "XGID=a--ABCB-C--acB---b-ccbB---:0:0:1:00:3:2:3:0:10",
      "XGID=ab-B--E-C---dCa--bAc--b-A-:0:0:1:00:3:5:3:0:10",
      "XGID=a-BCBBB----------bbdBAAbd-:1:1:1:00:0:0:3:0:10",
      "XGID=---Bb-E-DA--cC--ac-cab----:0:0:1:00:0:0:3:0:10",
      "XGID=-a--aBCCB---cC---bada-b-AA:0:0:1:00:99:59:3:0:10",
      "XGID=abBBBbDB---B-A---b-cabb---:0:0:1:00:0:0:3:0:10",
      "XGID=-DA-DBC--A----a---acbacbb-:1:1:1:00:0:0:3:0:10",
      "XGID=-b-A-aEBC-A-aC--b-a--bbbb-:1:1:1:00:1:0:3:0:10",
      "XGID=a---BBB-B---fD---b-dBbA---:0:0:1:00:8:3:3:0:10",
      "XGID=-BBCBAC-------------cddba-:0:0:1:00:0:0:3:0:10",
      "XGID=bCDDB-a--------AbbbbbA--b-:1:1:1:00:0:0:3:0:10",
      "XGID=---BaBBBCAA-c---bbbbbB-a--:0:0:1:00:0:0:3:0:10",
      "XGID=-b--BBC-B---cDa-ab-d-b-AA-:0:0:1:00:0:0:3:0:10",
      "XGID=--a-BaDBB---dCa--c-e---AA-:0:0:1:00:0:0:3:0:10",
      "XGID=bB-BBAB----AbBbA-b-bbcAA--:0:0:1:00:2:2:3:0:10",
      "XGID=-a--BBBBB---bCb--bbcBc----:0:0:1:00:0:0:3:0:10",
      "XGID=-Ba--bDDB-B----a--bcb-bb-A:0:0:1:00:7:2:3:0:10",
      "XGID=--ABB----------------ca---:1:1:1:00:0:0:3:0:10",
      "XGID=-BABBBB---------a-c-BbBfc-:0:0:1:00:0:0:1:0:10",
      "XGID=---BBaB-C-BBbB---bacbb--b-:1:1:1:00:0:0:3:0:10",
      "XGID=---bCBC-C-B-B--a-b-b-bbbb-:0:0:1:00:0:0:3:0:10",
      "XGID=bBBb-BC-B-AA-A---aacbbbA--:1:1:1:00:0:0:3:0:10",
      "XGID=a-BC-BEb---A-A--A--bbd-bb-:1:1:1:00:0:0:3:0:10",
      "XGID=-bB--BC-BA--bC---cbdB-b---:0:0:1:00:0:0:3:0:10",
      "XGID=bB--A-CABA--cC-b-c-e----B-:0:0:1:00:0:0:3:0:10",
      "XGID=a--bBBCA-B--bA---d-dCb--A-:0:0:1:00:0:0:3:0:10",
      "XGID=-a-b-BD-BB--dC---bBbbaa---:0:0:1:00:0:0:3:0:10",
      "XGID=-aBBBBB----B----A--cc-dBd-:0:0:1:00:0:0:3:0:10",
      "XGID=-ca-BBBCB---aB-b-a-cb-bA-A:0:0:1:00:0:0:3:0:10",
      "XGID=--B-B-CaB---fC---c-eB---A-:0:0:1:00:0:0:3:0:10",
      "XGID=-aaaBBE-----aD----bc-Bbbb-:1:1:1:00:0:0:3:0:10",
      "XGID=-a-a-BDBB---cC---cBc--b-b-:0:0:1:00:0:0:3:0:10",
      "XGID=aA--BBC-A--AeB---d-cCaa---:0:0:1:00:0:0:3:0:10",
      "XGID=--BA-bDBB---bC--abbbb-bA--:0:0:1:00:93:55:3:0:10",
      "XGID=a-B-BcB-B-A-cEA--b-d--b---:0:0:1:00:7:3:3:0:10",
      "XGID=a--ABBC-A--AbB---bcebB--A-:0:0:1:00:0:0:3:0:10",
      "XGID=aa---BCBCA--eB---c-cb-A-A-:0:0:1:00:0:0:3:0:10",
      "XGID=-ABCDCa--B------bcbcca----:1:1:1:00:0:0:3:0:10",
      "XGID=---BbCB-C-B--A------cdBf--:1:1:1:00:1:18:3:0:10",
      "XGID=---aBcCBB-BB-AA-----dbb-c-:1:1:1:00:0:0:3:0:10",
      "XGID=a----BBCB---bC---ebeAA--A-:0:0:1:00:0:0:3:0:10",
      "XGID=acBaAAC-B---cDA--b-c-Ab---:0:0:1:00:0:0:3:0:10",
      "XGID=---BCbCBCB--a----a-ccb-ba-:0:0:1:00:123:87:3:0:10",
      "XGID=-BDB-------a-----------ca-:1:1:1:00:0:0:3:0:10",
      "XGID=aaB-BBC-A---bC---c-cbbBa--:0:0:1:00:0:0:3:0:10",
      "XGID=-B--BcCCB---bC---aacbb-a--:0:0:1:00:0:0:3:0:10",
      "XGID=-a-B-CDaB---bC---cab-ab-bA:0:0:1:00:0:0:3:0:10",
      "XGID=-aa-BBBBB---aA--bbccB--bAA:0:0:1:00:12:1:3:0:10",
      "XGID=-----bECCaa-aB--bbbdB-----:0:0:1:00:126:87:3:0:10",
      "XGID=--ACBBBbB----C-a-aadbbb---:0:0:1:00:0:0:3:0:10",
      "XGID=-GbCC-AA----------abcbbab-:1:1:1:00:0:0:3:0:10",
      "XGID=b-B---EABA--dB---d-e----B-:0:0:1:00:0:0:3:0:10",
      "XGID=a-BB-BB-B---dC---c-cAb-bA-:1:1:1:00:104:74:3:0:10",
      "XGID=-ACbCaBB--A--B-Aabac--abb-:0:0:1:00:9:0:3:0:10",
      "XGID=-a--BCC-A--aeD----bccB----:0:0:1:00:0:0:3:0:10",
      "XGID=aABaB-C-B---cB-b-cAeA---A-:0:0:1:00:0:0:3:0:10",
      "XGID=---AbCC-FB----ba-a-cbb-b--:0:0:1:00:0:0:3:0:10",
      "XGID=aAB-CBBbA--AbB----bcbcA---:0:0:1:00:0:0:3:0:10",
      "XGID=-a-B-BBAC---cC---dBdb--a--:0:0:1:00:0:0:3:0:10",
      "XGID=bB--BAB-D--Bc----bbdbAA---:0:0:1:00:0:0:3:0:10",
      "XGID=--AABC---------------aadc-:1:1:1:00:0:0:3:0:10",
      "XGID=-aBBBCBbA----B---b-b-bbcaA:1:1:1:00:0:0:3:0:10",
      "XGID=b--BCbDAAb--B--a-bbbbA--A-:0:0:1:00:0:0:3:0:10",
      "XGID=-B-B-A-----------------bd-:0:0:1:00:0:0:3:0:10",
      "XGID=-a-a-BCCBB--bB--Aacbbab---:0:0:1:00:0:0:3:0:10",
      "XGID=---b-aEBCC--b---ad-bab-A-A:0:0:1:00:0:0:3:0:10",
      "XGID=aa--BaCBBA--cC---c-d-Ab-A-:0:0:1:00:0:0:3:0:10",
      "XGID=a--BBbBBB---cD-A-c-db-----:0:0:1:00:0:0:3:0:10",
      "XGID=-a-BBCB-A----A--B-a-dcBdb-:1:1:1:00:0:0:3:0:10",
      "XGID=aBBABBC------B--cccbbA-a--:0:0:1:00:124:87:3:0:10",
      "XGID=---Bb-E-DA--dC---c-cab----:0:0:1:00:0:0:3:0:10",
      "XGID=a--bB-DBB---cC-A-bbe----A-:0:0:1:00:0:0:3:0:10",
      "XGID=--CBC-Db--C-----a--aacbcb-:0:0:1:00:60:28:3:0:10",
      "XGID=aAb-B-DBBA---B-----bbAbbd-:1:1:1:00:0:0:3:0:10",
      "XGID=--B--A------------------d-:1:1:1:00:0:0:3:0:10",
      "XGID=a--ABBBBC-------bbbbCbaba-:1:1:1:00:0:0:3:0:10",
      "XGID=-aB--bDED------a--cbcba---:0:0:1:00:0:0:3:0:10",
      "XGID=-aB-aBB-B---dEa--c-da---B-:0:0:1:00:0:0:3:0:10",
      "XGID=-b--aBE-C---dD---c-da---A-:0:0:1:00:0:4:3:0:10",
      "XGID=a--A-BDBC---c-b--cBcb-A-a-:1:1:1:00:25:18:3:0:10",
      "XGID=-CCBBbC-B------a-bbccb----:1:1:1:00:0:0:3:0:10",
      "XGID=---ABbD-E---cC---a-ccb-a--:0:0:1:00:4:1:3:0:10",
      "XGID=-a--BBDA----bB---dbbBbbAA-:0:0:1:00:93:57:3:0:10",
      "XGID=-b--BBC-A---cEa-ac-e----B-:0:0:1:00:0:0:1:0:10",
      "XGID=-CB-DcB----BAA-aaa-bb--bc-:0:0:1:00:93:52:3:0:10",
      "XGID=-BBABBBbB----Ba---bbbbbb--:1:1:1:00:0:0:3:0:10",
      "XGID=-aa-bBCCB---bC-A-bbd---aA-:0:0:1:00:19:18:3:0:10",
      "XGID=---aBBBBBA---B----Bddbbb--:0:0:1:00:95:57:3:0:10",
      "XGID=a-BA-BD-B-B-bB-----ccbbb--:1:1:1:00:13:1:3:0:10",
      "XGID=-A-aDBC-CAaAa------bbbbbb-:0:0:1:00:93:57:3:0:10",
      "XGID=-ab-BBC-B--AcCA--c-b-Ab-b-:1:1:1:00:2:0:3:0:10",
      "XGID=aA-CCaB-C--AbB-----bbbbba-:1:1:1:00:0:0:3:0:10",
      "XGID=-B-BBbDB-C-----a---bccbb--:1:1:1:00:0:0:3:0:10",
      "XGID=-BCCDAB------------e-dcb--:1:1:1:00:28:60:3:0:10",
      "XGID=--bBBCB-B---bB-B-aabcca---:0:0:1:00:0:0:3:0:10",
      "XGID=-aa--BE-C-B-cC----acbb-b--:0:0:1:00:14:23:3:0:10",
      "XGID=aB--BaC-D---dB-----dcAb-A-:0:0:1:00:1:0:3:0:10",
      "XGID=---aBBDaB-A-bBAb-c-b-bA-b-:0:0:1:00:0:0:3:0:10",
      "XGID=aa---BD-B--AeD---c-e-A--A-:0:0:1:00:0:0:3:0:10",
      "XGID=--a--BCBB---eDa--c-e-A--A-:0:0:1:00:0:0:3:0:10",
      "XGID=-aBaB-CBA---bDa-abbc-b-A--:0:0:1:00:15:10:3:0:10",
      "XGID=--abBBC-D--a-Cb--Aabcab---:0:0:1:00:4:0:3:0:10",
      "XGID=a-BCBBB-----A----A-b-Bebe-:1:1:1:00:23:18:3:0:10",
      "XGID=-abBB-B-BA-DbB---bbcba----:0:0:1:00:0:0:3:0:10",
      "XGID=-a-bDBC------D--abbcbb-AA-:0:0:1:00:1:9:3:0:10",
      "XGID=ab-aaBD-C---eD---A-c--b-A-:0:0:1:00:0:0:3:0:10",
      "XGID=-BA-BaBBB-BB--a---a---dbf-:0:0:1:00:0:0:3:0:10",
      "XGID=aBaBBBB-AA--b--Bbcbbb-A---:2:1:1:00:14:15:3:0:10",
      "XGID=-a--CABBC--C-A-----c-ccbc-:1:1:1:00:0:0:3:0:10",
      "XGID=a-aBBBBA--A-cA---cbeB-A-A-:1:1:1:00:0:0:3:0:10",
      "XGID=-a--BaC-B--CbCa--c-da--b-B:0:0:1:00:0:0:3:0:10",
      "XGID=--BBBCB--A---A-A-dcd--Abb-:0:0:1:00:5:2:3:0:10",
      "XGID=-BBBBCB------a--AA----ccd-:1:1:1:00:0:0:3:0:10",
      "XGID=-b----EBCaA-dC-----cAb-ab-:0:0:1:00:0:0:3:0:10",
      "XGID=--bB--DCC-A-b--B-aababb-b-:0:0:1:00:0:0:3:0:10",
      "XGID=---BbCCBC-B----------bcdd-:0:0:1:00:9:14:3:0:10",
      "XGID=-c-B-CDA-----C---badbba-B-:0:0:1:00:0:0:3:0:10",
      "XGID=a-bBa-D-C--AbCa--d-d-A--A-:0:0:1:00:115:84:3:0:10",
      "XGID=bBA-aCB----acD---b-dCb----:0:0:1:00:0:0:3:0:10",
      "XGID=aBBBa-C-B---B--bAbcbA-bb--:0:0:1:00:0:0:3:0:10",
      "XGID=-A-cBbECC----A---babcb----:0:0:1:00:0:0:3:0:10",
      "XGID=a-BCCaD----C-------bbccab-:1:1:1:00:0:0:3:0:10",
      "XGID=aBB-BBBA-a-B-------cc-bBe-:1:1:1:00:0:0:3:0:10",
      "XGID=--BABBBa-B---B---babc-cBc-:1:1:1:00:0:0:3:0:10",
      "XGID=--aB-CCcB--C-Ba--bbcab----:0:0:1:00:0:0:3:0:10",
      "XGID=--aBB-DbB---cB--abCcc-----:0:0:1:00:0:0:3:0:10",
      "XGID=aCBCBBC-----------a-b-dcd-:1:1:1:00:0:0:3:0:10",
      "XGID=--aBBBC-B---bC-a-bccc-A---:0:0:1:00:0:0:3:0:10",
      "XGID=-a-BBBCC----bB--bb-ccb--A-:0:0:1:00:0:0:3:0:10",
      "XGID=---BBaDCB---bab--b-cBbb---:0:0:1:00:3:13:3:0:10",
      "XGID=-ab-B-DaCB---A-A-b-caBbab-:1:1:1:00:0:0:3:0:10",
      "XGID=---bBBE-B--BbB---a-ccac---:0:0:1:00:0:0:3:0:10",
      "XGID=-aBaBBC-A--acB--Ab-c-bb-B-:0:0:1:00:7:19:3:0:10",
      "XGID=-BDBD-BA-----------fcbaa--:1:1:1:00:0:0:3:0:10",
      "XGID=-a-aB-EBB---dB----bcBca---:0:0:1:00:0:0:3:0:10",
      "XGID=aa-BABD-----bD---b-d-bbaB-:0:0:1:00:0:0:3:0:10",
      "XGID=--BBBBC-A---dB--bb-ebA----:0:0:1:00:0:0:3:0:10",
      "XGID=--bB-BC-AA-AcD---d-d--b-A-:0:0:1:00:0:0:3:0:10",
      "XGID=aB-B--BaD-A-cC---b-Ab-bbb-:0:0:1:00:0:0:3:0:10",
    ];
  }
}
