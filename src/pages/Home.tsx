import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  useIonToast,
  useIonViewWillEnter,
  IonButton
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";

import "./Home.css";
import { useEffect, useState } from "react";

const Home: React.FC<RouteComponentProps> = (props) => {
  
  // useIonViewWillEnter( () => {
  //   checkBluetoothEnabled();
  // }); 

  //let pairedList: any = [];
  let listToggle: boolean;
  //const bluetoothSerial: BluetoothSerial;
  let pairedDeviceId: number = 0;
  const [present, dismiss] = useIonToast();
  const [pairedList, setPairedList] = useState<any>([]);

  useEffect(()=> {

    console.log("ENTRE ACA")

  }, [pairedList])

  const checkBluetoothEnabled = () => {
    console.log("Button clicked");
    BluetoothSerial.isEnabled().then(
      (success) => {
        console.log("Enabled success: ", success);
        listPairedDevices();
      },
      (error) => {
        showError(error);
      }
    );
  };

  const listPairedDevices = () => {
    BluetoothSerial.list().then(
      (success) => {
        console.log("Devices List: ", success);

        //pairedList = success;
        setPairedList(success);
        listToggle = true;
        console.log("Paired list: ", pairedList);
      },
      (error) => {
        showError("Please Enable Bluetooth");
        listToggle = false;
      }
    );
  };

  const showError = (message: string) => {
    console.log(message);
  };

  const connect = (address: string) => {
    BluetoothSerial.connect(address).subscribe(
      (success: any) => {
        deviceConnected();
        showToast("Conectado correctamente");
      },
      (error: any) => {
        showError("No se ha podido conectar, algo ha fallado.");
      }
    );
  };

  const deviceConnected = () => {
    BluetoothSerial.subscribe("\n").subscribe(
      (success: any) => {
        handleData(success);
        showToast("Conectado correctamente");
      },
      (error: any) => {
        showError(error);
      }
    );
  };

  const showToast = (message: string) => {
    present(message, 5000);
  };

  const handleData = (data: any) => {
    //Montar aquí el sistema para tratar la entrada desde el dispositivo al que nos hemos conectado.
    showToast(data);
  };

  const selectDevice = () => {
    let connectedDevice: any = pairedList[pairedDeviceId];
    if (!connectedDevice.address) {
      showError("Selecciona un dispositivo al que conecterse");
      return;
    }
    let address = connectedDevice.address;
    let name = connectedDevice.name;
    connect(address);
  };

  const addElementPairedList = () => {
    setPairedList([...pairedList, { address: "hola mundo", name: "test"}]);
    console.log(pairedList);
  }

  return (
    
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>SIM</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        
        <IonButton color="primary" onClick={checkBluetoothEnabled}>Iniciar busqueda</IonButton>
        <IonButton color="primary" onClick={addElementPairedList}>TestV3</IonButton>

        {pairedList.length > 0 && 
          <IonList>
            {console.log("REFRESSH")}
            {pairedList.map((pairedItem:any) => 
              <IonItem >
                  <IonLabel>Address: {pairedItem.address}  - Name: {pairedItem.name} {console.log(pairedItem)}</IonLabel>
              </IonItem>
            )}
          </IonList>
        }
      </IonContent>
    </IonPage>
  );
};

export default Home;
