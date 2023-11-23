class HelperService {
  private marka: string;
  private model: string;
  private hiz: number;

  constructor(marka: string, model: string) {
    this.marka = marka;
    this.model = model;
    this.hiz = 10;
  }

  hiziGoster(): void {
    console.log(`${this.marka} ${this.model}'in hızı: ${this.hiz} km/s`);
  }

  hizlan(kacKm: number): void {
    this.hiz += kacKm;
    console.log(
      `${this.marka} ${this.model} hızlandı! Yeni hız: ${this.hiz} km/s`
    );
  }

  yavasla(kacKm: number): void {
    this.hiz -= kacKm;
    console.log(
      `${this.marka} ${this.model} yavaşladı! Yeni hız: ${this.hiz} km/s`
    );
  }
}

export default HelperService;
