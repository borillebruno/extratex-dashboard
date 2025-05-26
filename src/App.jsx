import React, { useState, useEffect } from 'react';

function App() {
  const [oreWeight, setOreWeight] = useState('');
  const [goldPerTon, setGoldPerTon] = useState('');
  const [silverPerTon, setSilverPerTon] = useState('');
  const [humidity, setHumidity] = useState('');
  const [copperContent, setCopperContent] = useState('');
  const [refineryChargeRC, setRefineryChargeRC] = useState('');
  const [refineryChargeTC, setRefineryChargeTC] = useState('');
  const [lmePercentage, setLmePercentage] = useState('96.25');
  const [goldPayablePercentage, setGoldPayablePercentage] = useState('80');
  const [silverPayablePercentage, setSilverPayablePercentage] = useState('80');

  const [liveLMECopperPrice, setLiveLMECopperPrice] = useState(0);
  const [liveGoldPrice, setLiveGoldPrice] = useState(0);
  const [liveSilverPrice, setLiveSilverPrice] = useState(0);

  const [useCustomPrices, setUseCustomPrices] = useState(false);
  const [customCopperPrice, setCustomCopperPrice] = useState('');
  const [customGoldPrice, setCustomGoldPrice] = useState('');
  const [customSilverPrice, setCustomSilverPrice] = useState('');

  const [dryMetricTon, setDryMetricTon] = useState(0);
  const [totalGold, setTotalGold] = useState(0);
  const [totalSilver, setTotalSilver] = useState(0);
  const [totalCopper, setTotalCopper] = useState(0);
  const [totalRefineryCharges, setTotalRefineryCharges] = useState(0);
  const [estimatedCopperValue, setEstimatedCopperValue] = useState(0);
  const [estimatedGoldValue, setEstimatedGoldValue] = useState(0);
  const [estimatedSilverValue, setEstimatedSilverValue] = useState(0);
  const [totalExportValue, setTotalExportValue] = useState(0);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);

  useEffect(() => {
    const loadScript = (id, src, callback) => {
      if (document.getElementById(id)) {
        if (callback) callback();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.onload = () => {
        if (callback) callback();
      };
      script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
      };
      document.head.appendChild(script);
    };

    loadScript('xlsx-cdn', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', () => {
      console.log('XLSX loaded');
    });
  }, []);

  useEffect(() => {
    setLiveLMECopperPrice(9850);
    setLiveGoldPrice(2350);
    setLiveSilverPrice(30);
  }, []);

  useEffect(() => {
    const weight = parseFloat(oreWeight) || 0;
    const gold = parseFloat(goldPerTon) || 0;
    const silver = parseFloat(silverPerTon) || 0;
    const hum = parseFloat(humidity) || 0;
    const copper = parseFloat(copperContent) || 0;
    const rc = parseFloat(refineryChargeRC) || 0;
    const tc = parseFloat(refineryChargeTC) || 0;
    const lmePerc = parseFloat(lmePercentage) || 0;
    const goldPayablePerc = parseFloat(goldPayablePercentage) || 0;
    const silverPayablePerc = parseFloat(silverPayablePercentage) || 0;

    const currentCopperPrice = useCustomPrices && parseFloat(customCopperPrice) > 0 ? parseFloat(customCopperPrice) : liveLMECopperPrice;
    const currentGoldPrice = useCustomPrices && parseFloat(customGoldPrice) > 0 ? parseFloat(customGoldPrice) : liveGoldPrice;
    const currentSilverPrice = useCustomPrices && parseFloat(customSilverPrice) > 0 ? parseFloat(customSilverPrice) : liveSilverPrice;

    const calculatedDMT = weight * (1 - hum / 100);
    setDryMetricTon(calculatedDMT);

    const calculatedTotalGold = calculatedDMT * gold;
    setTotalGold(calculatedTotalGold);

    const calculatedTotalSilver = calculatedDMT * silver;
    setTotalSilver(calculatedTotalSilver);

    const calculatedTotalCopper = calculatedDMT * (copper / 100);
    setTotalCopper(calculatedTotalCopper);

    const calculatedTotalRefineryCharges = calculatedDMT * (rc + tc);
    setTotalRefineryCharges(calculatedTotalRefineryCharges);

    const calculatedEstimatedCopperValue = calculatedTotalCopper * currentCopperPrice * (lmePerc / 100);
    setEstimatedCopperValue(calculatedEstimatedCopperValue);

    const calculatedEstimatedGoldValue = calculatedTotalGold * (1 / 31.1035) * currentGoldPrice * (goldPayablePerc / 100);
    setEstimatedGoldValue(calculatedEstimatedGoldValue);

    const calculatedEstimatedSilverValue = calculatedTotalSilver * (1 / 31.1035) * currentSilverPrice * (silverPayablePerc / 100);
    setEstimatedSilverValue(calculatedEstimatedSilverValue);

    const calculatedTotalExportValue = calculatedEstimatedCopperValue + calculatedEstimatedGoldValue + calculatedEstimatedSilverValue;
    setTotalExportValue(calculatedTotalExportValue);
  }, [oreWeight, goldPerTon, silverPerTon, humidity, copperContent, refineryChargeRC, refineryChargeTC, lmePercentage, goldPayablePercentage, silverPayablePercentage, liveLMECopperPrice, liveGoldPrice, liveSilverPrice, useCustomPrices, customCopperPrice, customGoldPrice, customSilverPrice]);

  const handleClear = () => {
    setOreWeight('');
    setGoldPerTon('');
    setSilverPerTon('');
    setHumidity('');
    setCopperContent('');
    setRefineryChargeRC('');
    setRefineryChargeTC('');
    setLmePercentage('96.25');
    setGoldPayablePercentage('80');
    setSilverPayablePercentage('80');
    setUseCustomPrices(false);
    setCustomCopperPrice('');
    setCustomGoldPrice('');
    setCustomSilverPrice('');
  };

  const generateExcelDocument = () => {
    setIsGeneratingExcel(true);
    if (typeof window.XLSX === 'undefined') {
      console.error("XLSX library is not loaded. Please wait a moment or refresh the page.");
      setIsGeneratingExcel(false);
      return;
    }

    const data = [
      ["Extratex Copper Dashboard - Calculation Summary"],
      [],
      ["Date:", new Date().toLocaleDateString()],
      [],
      ["--- Input Parameters ---"],
      ["Copper Ore Weight:", oreWeight, "tons"],
      ["Gold Content:", goldPerTon, "g/ton"],
      ["Silver Content:", silverPerTon, "g/ton"],
      ["Humidity Content:", humidity, "%"],
      ["Copper Content:", copperContent, "%"],
      ["LME Selling Percentage:", lmePercentage, "%"],
      ["Gold Payable Percentage:", goldPayablePercentage, "%"],
      ["Silver Payable Percentage:", silverPayablePercentage, "%"],
      ["Refinery Charge (RC):", refineryChargeRC, "$/ton"],
      ["Refinery Charge (TC):", refineryChargeTC, "$/ton"],
      [],
      ["--- Market Prices Used ---"],
      ["Live LME Copper Price:", liveLMECopperPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "$/ton"],
      ["Live LBMA Gold Price:", liveGoldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "$/troy oz"],
      ["Live LBMA Silver Price:", liveSilverPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "$/troy oz"],
      ["Custom Prices Used:", useCustomPrices ? "Yes" : "No"],
      ...(useCustomPrices ? [
        ["Custom Copper Price:", customCopperPrice, "$/ton"],
        ["Custom Gold Price:", customGoldPrice, "$/troy oz"],
        ["Custom Silver Price:", customSilverPrice, "$/troy oz"],
      ] : []),
      [],
      ["--- Calculated Results ---"],
      ["Dry Metric Ton (DMT):", dryMetricTon.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "tons"],
      ["Total Gold Content:", totalGold.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "grams"],
      ["Total Silver Content:", totalSilver.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "grams"],
      ["Total Copper Content:", totalCopper.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "tons"],
      ["Total Refinery Charges (RC + TC):", totalRefineryCharges.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "$"],
      [],
      ["--- Estimated Values ---"],
      ["Estimated Copper Value:", estimatedCopperValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "$"],
      ["Estimated Gold Value:", estimatedGoldValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "$"],
      ["Estimated Silver Value:", estimatedSilverValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "$"],
      ["Total Export Value:", totalExportValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "$"],
    ];

    const ws = window.XLSX.utils.aoa_to_sheet(data);
    const colWidths = [
      { wch: 30 },
      { wch: 15 },
      { wch: 10 }
    ];
    ws['!cols'] = colWidths;
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
    
    if (ws['A1']) {
      ws['A1'].s = { alignment: { horizontal: "center" }, font: { bold: true, sz: 16 } };
    }

    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Copper_Ore_Summary");
    window.XLSX.writeFile(wb, "Extratex_Copper_Summary.xlsx");

    setIsGeneratingExcel(false);
  };

  const InputField = ({ label, value, onChange, placeholder, unit, disabled = false }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className={`flex items-center border rounded-lg shadow-sm ${disabled ? 'bg-gray-100' : 'focus-within:ring-2 focus-within:ring-blue-500'}`}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
              onChange(newValue);
            }
          }}
          placeholder={placeholder}
          className="shadow appearance-none border-none rounded-l-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
          disabled={disabled}
        />
        {unit && <span className="px-3 text-gray-500 bg-gray-100 rounded-r-lg border-l border-gray-200 py-2">{unit}</span>}
      </div>
    </div>
  );

  const ResultDisplay = ({ label, value, unit }) => (
    <div className="mb-2">
      <p className="text-gray-700 text-base">
        <span className="font-semibold">{label}:</span> {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {unit}
      </p>
    </div>
  );

  const LivePriceDisplay = ({ label, price, unit }) => (
    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
      <span className="text-blue-800 font-semibold text-sm sm:text-base">{label}:</span>
      <span className="text-blue-900 font-bold text-base sm:text-lg">
        {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {unit}
      </span>
    </div>
  );

  return (
    <div className="content-container bg-gradient-to-br from-blue-100 to-indigo-200 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-6xl border border-gray-200">
        <div className="flex justify-center mb-8">
          <img
            src={`${process.env.PUBLIC_URL}/Extratex Logo.png`}
            alt="Extratex Logo"
            className="h-20 w-auto"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x80/cccccc/333333?text=Logo'; }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <LivePriceDisplay label="Live LME Copper" price={liveLMECopperPrice} unit="$/ton" />
          <LivePriceDisplay label="Live LBMA Gold" price={liveGoldPrice} unit="$/troy oz" />
          <LivePriceDisplay label="Live LBMA Silver" price={liveSilverPrice} unit="$/troy oz" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Input Parameters</h2>
            <InputField
              label="Copper Ore Weight"
              value={oreWeight}
              onChange={setOreWeight}
              placeholder="e.g., 1000"
              unit="tons"
            />
            <InputField
              label="Gold Content"
              value={goldPerTon}
              onChange={setGoldPerTon}
              placeholder="e.g., 0.5"
              unit="g/ton"
            />
            <InputField
              label="Silver Content"
              value={silverPerTon}
              onChange={setSilverPerTon}
              placeholder="e.g., 10"
              unit="g/ton"
            />
            <InputField
              label="Humidity Content"
              value={humidity}
              onChange={setHumidity}
              placeholder="e.g., 8"
              unit="%"
            />
            <InputField
              label="Copper Content"
              value={copperContent}
              onChange={setCopperContent}
              placeholder="e.g., 25"
              unit="%"
            />
            <InputField
              label="LME Selling Percentage"
              value={lmePercentage}
              onChange={setLmePercentage}
              placeholder="e.g., 96.25"
              unit="%"
            />
            <InputField
              label="Gold Payable Percentage"
              value={goldPayablePercentage}
              onChange={setGoldPayablePercentage}
              placeholder="e.g., 80"
              unit="%"
            />
            <InputField
              label="Silver Payable Percentage"
              value={silverPayablePercentage}
              onChange={setSilverPayablePercentage}
              placeholder="e.g., 80"
              unit="%"
            />
            <InputField
              label="Refinery Charge (RC)"
              value={refineryChargeRC}
              onChange={setRefineryChargeRC}
              placeholder="e.g., 50"
              unit="$/ton"
            />
            <InputField
              label="Refinery Charge (TC)"
              value={refineryChargeTC}
              onChange={setRefineryChargeTC}
              placeholder="e.g., 150"
              unit="$/ton"
            />

            <div className="mb-4 flex items-center mt-6">
              <input
                type="checkbox"
                id="useCustomPrices"
                checked={useCustomPrices}
                onChange={(e) => setUseCustomPrices(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="useCustomPrices" className="text-gray-700 text-sm font-bold">
                Use Custom Prices
              </label>
            </div>

            {useCustomPrices && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner border border-gray-200 mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Custom Prices</h3>
                <InputField
                  label="Custom Copper Price"
                  value={customCopperPrice}
                  onChange={setCustomCopperPrice}
                  placeholder="e.g., 9700"
                  unit="$/ton"
                />
                <InputField
                  label="Custom Gold Price"
                  value={customGoldPrice}
                  onChange={setCustomGoldPrice}
                  placeholder="e.g., 2300"
                  unit="$/troy oz"
                />
                <InputField
                  label="Custom Silver Price"
                  value={customSilverPrice}
                  onChange={setCustomSilverPrice}
                  placeholder="e.g., 28"
                  unit="$/troy oz"
                />
              </div>
            )}

            <button
              onClick={handleClear}
              className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Clear All
            </button>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-100">
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Calculated Results</h2>
              <ResultDisplay label="Dry Metric Ton (DMT)" value={dryMetricTon} unit="tons" />
              <ResultDisplay label="Total Gold Content" value={totalGold} unit="grams" />
              <ResultDisplay label="Total Silver Content" value={totalSilver} unit="grams" />
              <ResultDisplay label="Total Copper Content" value={totalCopper} unit="tons" />
              <ResultDisplay label="Total Refinery Charges (RC + TC)" value={totalRefineryCharges} unit="$" />
              <hr className="my-4 border-blue-200" />
              <h3 className="text-xl font-bold text-blue-700 mb-4">Estimated Values</h3>
              <ResultDisplay label="Estimated Copper Value" value={estimatedCopperValue} unit="$" />
              <ResultDisplay label="Estimated Gold Value" value={estimatedGoldValue} unit="$" />
              <ResultDisplay label="Estimated Silver Value" value={estimatedSilverValue} unit="$" />
              <hr className="my-4 border-blue-200" />
              <ResultDisplay label="Total Export Value" value={totalExportValue} unit="$" />

              <button
                onClick={generateExcelDocument}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center justify-center"
                disabled={isGeneratingExcel}
              >
                {isGeneratingExcel ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></div>
                    Generating Excel...
                  </div>
                ) : (
                  '📊 Generate Excel Document 📊'
                )}
              </button>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800">
              <p className="font-semibold mb-2">How calculations are made:</p>
              <ul className="list-disc list-inside text-sm">
                <li><span className="font-medium">Dry Metric Ton (DMT):</span> Ore Weight × (1 - Humidity / 100)</li>
                <li><span className="font-medium">Total Gold/Silver:</span> DMT × Content (g/ton)</li>
                <li><span className="font-medium">Total Copper:</span> DMT × Copper Content (%) / 100</li>
                <li><span className="font-medium">Total Refinery Charges:</span> DMT × (RC + TC)</li>
                <li><span className="font-medium">Estimated Copper Value:</span> Total Copper (tons) × Current Copper Price × (LME Percentage / 100)</li>
                <li><span className="font-medium">Estimated Gold Value:</span> Total Gold (grams) × (1 troy oz / 31.1035 grams) × Current Gold Price × (Gold Payable Percentage / 100)</li>
                <li><span className="font-medium">Estimated Silver Value:</span> Total Silver (grams) × (1 troy oz / 31.1035 grams) × Current Silver Price × (Silver Payable Percentage / 100)</li>
                <li><span className="font-medium">Total Export Value:</span> Estimated Copper Value + Estimated Gold Value + Estimated Silver Value</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;