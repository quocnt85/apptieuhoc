import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { soundService } from './audio';

class InteractionService {
  private hapticsEnabled: boolean = true;

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
  }

  // Trigger gentle tactile vibration (Capacitor or Web Vibration API)
  private triggerVibrate(pattern: number | number[]) {
    if (!this.hapticsEnabled) return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore if not supported
    }
  }

  // 1. Nhẹ nhàng khi bấm nút thường hoặc đổi tab (Light Tap)
  public async playTap() {
    soundService.playClick();
    if (!this.hapticsEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      this.triggerVibrate(12);
    }
  }

  // 2. Chạm vào thẻ lựa chọn (Selection Tap)
  public async playSelect() {
    soundService.playClick();
    if (!this.hapticsEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      this.triggerVibrate(18);
    }
  }

  // 3. Trả lời đúng, nối cặp thành công (Success / Correct)
  public async playSuccess() {
    soundService.playCorrect();
    if (!this.hapticsEnabled) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      this.triggerVibrate([20, 30, 40]);
    }
  }

  // 4. Trả lời sai, chướng ngại vật (Warning / Error)
  public async playError() {
    soundService.playWrong();
    if (!this.hapticsEnabled) return;
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      this.triggerVibrate([40, 20, 40]);
    }
  }

  // 5. Nhặt sao, thu thập vật phẩm (Coin Collect)
  public async playCoin() {
    soundService.playCoin();
    if (!this.hapticsEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      this.triggerVibrate(25);
    }
  }

  // 6. Thăng cấp, thắng Boss, hoàn thành bài học (Fanfare Victory)
  public async playVictory() {
    soundService.playLevelUp();
    if (!this.hapticsEnabled) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
      setTimeout(async () => {
        try {
          await Haptics.impact({ style: ImpactStyle.Heavy });
        } catch {
          this.triggerVibrate([50, 40, 60, 40, 80]);
        }
      }, 250);
    } catch {
      this.triggerVibrate([40, 30, 50, 30, 100]);
    }
  }
}

export const interactionService = new InteractionService();
