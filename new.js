const { useState } = React;
const root = ReactDOM.createRoot(document.getElementById('root'));



function App() {



    // 資料狀態----------------------------------------------------------
    // 新增幣種 創建要組進去陣列內的物件格式
    const [newCurrency, setNewCurrency] = useState(
        { name: '', rate: 0 });

    // 原本的匯率陣列 我組的新增會加進來
    const [currency, setCurrency] = useState([
        { name: '日幣', rate: 4.54 },
        { name: '美金', rate: 0.0314 },
        { name: '韓幣', rate: 45.18 },
    ]);

    // 錢包
    const [wallet, setWallet] = useState(5000);

    // 預計要換的金幣顯示
    const [exchange, setExchange] = useState(0);

    // Lv3 兌換記錄的陣列
    const [record, setRecord] = useState([]);
    // ---------------------------------------------------------------





    // LV1-------------------------------------------------------------
    // 匯率的顯示 但有無限浮點數陷阱  參考自己的 變數 浮點運算小數位 章節 的網頁解答
    const calcExchange = rate => ((calcShow || 0) * rate).toFixed(2);

    // 欄位變更的即時顯示
    const handleChange = (e) => {
        const { value } = e.target
        setExchange(parseInt(value))  //轉數字
        // setExchange(parseInt(e.target.value)) 和上面一樣意思
        // 每次變更 就改變顯示的值
    }

    // 抓欄位exchange 使用setCalcShow賦予到calcShow 再放入匯率的顯示的位置 
    const [calcShow, setCalcShow] = useState(0);

    // 兌換 按鈕點下 才執行匯率顯示 (利用JSX資料狀態變更才變更畫面狀態特性)
    // 點擊觸發的這個兌換按鈕函式  將欄位的 輸入的金額 放入顯示函式 丟入JSX位置
    const handleCalc = () => {

        if (exchange <= 0) {
            alert('小於等於0，無需計算');
            setExchange(0);
            return
        }
        setCalcShow(exchange)
    }
    // ---------------------------------------------------------------







    // LV2-------------------------------------------------------------
    // 新增幣種及匯率的改變監聽 並存放到 要增加貨幣的資料狀態  (下面有另種一樣行為的寫法)
    const handleAdd = (e) => {
        const { name, value } = e.target; // 從我所點擊的 e.target 取出該屬性的 "值"
        setNewCurrency((prev) => {
            return {
                ...prev, [name]: value,
                // ...前一個狀態物 , 增加的東西
            };
            // 依據我點到的 name值 去增加value 用物件讀取的方式進去前面的物件 並回傳return
        });
    }
    // const handleAdd = e => {
    //     if (e.target.name == 'newCurrencyName')
    //         setNewCurrency({ ...newCurrency, name: e.target.value.trim() });
    //     else
    //         setNewCurrency({ ...newCurrency, rate: e.target.value.trim() })
    // }
    // ---------------

    // 新增幣種 狀態變更後 會產生個別單條li (React監測到資料狀態更新)
    const handleAddBtn = () => {
        // 是否已有存在 從貨幣內尋找 item  等於要新增的 就告知重複
        let isExist = currency.find(item => item.name == newCurrency.name);

        if (isExist) {
            alert('已經有啦 別加了');
            return
        }
        setCurrency([...currency, newCurrency])  // 經過判斷後 將填好的名稱 及匯率 放入要新增的
        setNewCurrency({ name: '', rate: 0 }); // 要組物件的清空等待下次新增
    }
    // ---------------------------------------------------------------








    // lv3------------------------------------------------------------
    // 進行兌換記錄 及錢包餘額使用
    const doExchange = (e) => {

        let currencyName = e.target.name;  // 點擊抓出  跑map時存放的name
        console.log(currencyName)

        let rate = currency.find(item => item.name == currencyName).rate;  // 找出我要的回傳.rate



        // 組出  兌換記錄的物件 (放這邊下面的if函式才抓取的到組建)
        let recordItem = {
            changeID: new Date().getTime(),
            currencyName,   // 上面有抓出點擊的該項名稱
            exchange,       // 當前顯示要換的金額
            currencyTotal: exchange * rate,   // 要換的金額乘上匯率
            status: (wallet >= exchange && exchange != 0 && exchange > 0 ? '成功' : '失敗')
        }





        // ------------------------------------------------------
        // 抓取螢幕上 (若他還沒按計算的話 就從螢幕上抓)
        if (exchange > wallet) {
            setRecord(prevArr => [...prevArr, recordItem])
            alert("錢不夠兌換啦，快充值");
            setExchange(0);
            return;
        }
        if (wallet <= 0) {   // 這裡保險寫 在計算位置已經寫了小於0 無需計算
            setRecord(prevArr => [...prevArr, recordItem])
            alert("錢包看來是沒錢了");
            setExchange(0);
            return;
        }
        if (exchange <= 0) {   // 這裡保險寫 在計算位置已經寫了小於0 無需計算
            setRecord(prevArr => [...prevArr, recordItem])
            alert("請填入需兌換的台幣，小於等於0為無效");
            setExchange(0);
            return;
        }
        // ------------------------------------------------------



        // 判斷完才進行餘額扣除 上面可能有return結束函式的需要
        setWallet(wallet - exchange);

        setExchange(0);
        setRecord(prevArr => [...prevArr, recordItem])
        // 也必須先進行失敗或成功的判斷 把成功的函式放下面
        // 把前個資料狀態抓出 放進點擊當下會再組建一次的  兌換記錄物件recordItem


        // 也可以這樣寫  不組建 直接當傳入
        // setRecord(prevArr => [...prevArr, {
        //     changeID: new Date().getTime(),
        //     currencyName,   // 上面有抓出點擊的該項名稱
        //     exchange,       // 當前顯示要換的金額
        //     currencyTotal: exchange * rate   // 要換的金額乘上匯率
        // }])

    }




    // ---------------------------------------------------------------

    return (
        <>
            <input name='name' type="text" onChange={handleAdd} placeholder="幣種" />
            <input name='rate' type="text" onChange={handleAdd} placeholder="匯率" />
            <input type="button" disabled={!newCurrency.name || !newCurrency.rate} onClick={handleAddBtn} value="新增幣種" />

            <hr />

            <h2>輸入要兌換的台幣-即時計算匯率兌換</h2>
            <input type="number" onChange={handleChange} value={exchange} placeholder='台幣輸入' />
            <input type="button" onClick={handleCalc} value="計算" />

            <ul>
                {
                    currency.map((item, index) => {
                        return <li key={item.name}>{item.name}：{calcExchange(item.rate)}

                            <input onClick={doExchange} disabled={calcExchange(item.rate) == 0} type="button" name={item.name} value="兌換" /></li>
                    })
                }
            </ul>

            <hr />
            <h3>您錢包還有 {wallet} 元</h3>

            <h3>您的兌換記錄</h3>
            <ul>
                <li>您用100元台幣，兌換了454日幣-此為預設</li>
                <li>您用100元台幣，兌換了3.3美金-此為預設</li>

                {
                    record.map((item, i) => {
                        return <li key={item.changeID}>您用{item.exchange}元台幣，兌換了{item.currencyTotal.toFixed(2)}{item.currencyName} {item.status}</li>
                    })
                }

            </ul>
        </>
    )
}


root.render(<App />);