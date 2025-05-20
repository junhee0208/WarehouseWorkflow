declare module 'html5-qrcode' {
  export interface QrDimensions {
    width: number;
    height: number;
  }

  export interface QrBox {
    width: number;
    height: number;
  }

  export interface Html5QrcodeScannerConfig {
    fps?: number;
    qrbox?: number | QrBox;
    aspectRatio?: number;
    disableFlip?: boolean;
    videoConstraints?: MediaTrackConstraints;
  }

  export interface Html5QrcodeCameraScanConfig {
    fps: number;
    qrbox?: number | QrBox;
    aspectRatio?: number;
    disableFlip?: boolean;
    videoConstraints?: MediaTrackConstraints;
  }

  export interface CameraDevice {
    id: string;
    label: string;
  }

  export interface Html5QrcodeResult {
    decodedText: string;
    result: {
      text: string;
      format: {
        format: string;
        formatName: string;
      };
    };
  }

  export interface Html5QrcodeError {
    errorMessage: string;
    exception: any;
  }

  export type QrcodeSuccessCallback = (
    decodedText: string,
    result: Html5QrcodeResult
  ) => void;

  export type QrcodeErrorCallback = (
    errorMessage: string,
    error: Html5QrcodeError
  ) => void;

  export type CameraDeviceListCallback = (
    devices: CameraDevice[]
  ) => void;

  export class Html5Qrcode {
    constructor(elementId: string);

    start(
      cameraIdOrConfig: string | MediaTrackConstraints,
      configuration: Html5QrcodeCameraScanConfig,
      qrCodeSuccessCallback: QrcodeSuccessCallback | ((decodedText: string) => void),
      qrCodeErrorCallback?: QrcodeErrorCallback
    ): Promise<void>;

    stop(): Promise<boolean>;

    pause(shouldPauseVideo?: boolean): void;
    resume(): void;

    getState(): any;
    isScanning(): boolean;

    clear(): void;

    static getCameras(): Promise<CameraDevice[]>;

    applyVideoConstraints(videoConstraints: MediaTrackConstraints): Promise<boolean>;
    
    enableTorch(): Promise<void>;
    disableTorch(): Promise<void>;
  }

  export class Html5QrcodeScanner {
    constructor(
      elementId: string,
      config: Html5QrcodeScannerConfig,
      verbose?: boolean
    );

    render(
      qrCodeSuccessCallback: QrcodeSuccessCallback,
      qrCodeErrorCallback?: QrcodeErrorCallback
    ): void;

    pause(shouldPauseVideo?: boolean): void;
    resume(): void;

    getState(): any;
    clear(): void;
  }
}
