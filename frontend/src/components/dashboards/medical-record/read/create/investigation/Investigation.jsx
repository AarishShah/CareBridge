function Investiagtion({ formData, updateFields }) {
  const {
    completeBloodCount,
    liverFunctionTests,
    renalFunctionTests,
    vitalMarkers,
    serumElectrolytes,
    prothrombinTime,
    activatedPartialThromboplastinTime,
    electrocardiogram,
    chestXRay,
  } = formData.investigations;

  return (
    <div>
      <label htmlFor="completeBloodCount">Complete Blood Count</label>
      <input
        value={completeBloodCount}
        onChange={(event) =>
          updateFields({
            investigations: {
              ...formData.investigations,
              completeBloodCount: event.target.value,
            },
          })
        }
      />
      <label htmlFor="liverFunctionTests">Liver Function Tests</label>
      <input
        value={liverFunctionTests}
        onChange={(event) =>
          updateFields({
            investigations: {
              ...formData.investigations,
              liverFunctionTests: event.target.value,
            },
          })
        }
      />
      <label htmlFor="renalFunctionTests">Renal Function Tests</label>
      <input
        value={renalFunctionTests}
        onChange={(event) =>
          updateFields({
            investigations: {
              ...formData.investigations,
              renalFunctionTests: event.target.value,
            },
          })
        }
      />
      <label htmlFor="vitalMarkers">Vital Markers</label>
      <input
        value={vitalMarkers}
        onChange={(event) =>
          updateFields({
            investigations: {
              ...formData.investigations,
              vitalMarkers: event.target.value,
            },
          })
        }
      />
      <label htmlFor="serumElectrolytes">Serum Electrolytes</label>
      <input
        value={serumElectrolytes}
        onChange={(event) =>
          updateFields({
            investigations: {
              ...formData.investigations,
              serumElectrolytes: event.target.value,
            },
          })
        }
      />
      <label htmlFor="prothrombinTime">Prothrombin Time</label>
      <input
        value={prothrombinTime}
        onChange={(event) =>
          updateFields({
            investigations: {
              ...formData.investigations,
              prothrombinTime: event.target.value,
            },
          })
        }
      />
      <label htmlFor="activatedPartialThromboplastinTime">
        Activated Partial Thromboplastin Time
      </label>
      <input
        value={activatedPartialThromboplastinTime}
        onChange={(event) =>
          updateFields({
            investigations: {
              ...formData.investigations,
              activatedPartialThromboplastinTime: event.target.value,
            },
          })
        }
      />
      <label htmlFor="electrocardiogram">Electro-cardiogram</label>
      <input
        value={electrocardiogram}
        onChange={(event) =>
          updateFields({
            investigations: {
              ...formData.investigations,
              electrocardiogram: event.target.value,
            },
          })
        }
      />
      <label htmlFor="chestXRay">Chest XRay</label>
      <input
        value={chestXRay}
        onChange={(event) =>
          updateFields({
            investigations: {
              ...formData.investigations,
              chestXRay: event.target.value,
            },
          })
        }
      />
    </div>
  );
}

export default Investiagtion;
