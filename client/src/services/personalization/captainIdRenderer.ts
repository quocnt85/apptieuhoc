import type { LocalMediaAsset } from '../../types/personalization';
import { getMediaStorage } from './mediaStorage';

export interface CaptainIdFields {
  nickname: string;
  grade: number;
  title: string;
  totalStars: number;
  completedCoordinates: number;
  avatarAsset?: LocalMediaAsset | null;
  approvedFlagAsset?: LocalMediaAsset | null;
  presetAvatar: string;
}

export const sanitizeCaptainIdFields = (fields: CaptainIdFields) => ({
  nickname: fields.nickname.trim().slice(0, 24) || 'Phi hành gia Nova',
  grade: Math.max(1, Math.min(5, Math.round(fields.grade || 1))),
  title: fields.title.trim().slice(0, 40) || 'Nhà thám hiểm tập sự',
  totalStars: Math.max(0, Math.round(fields.totalStars || 0)),
  completedCoordinates: Math.max(0, Math.round(fields.completedCoordinates || 0)),
  presetAvatar: [...fields.presetAvatar].slice(0, 4).join('') || '🧑‍🚀',
});

export const buildCaptainIdFilename = (now = new Date()) => `novastars-space-id-${now.toISOString().slice(0,10)}.png`;

const loadAssetImage = async (asset?: LocalMediaAsset | null) => {
  if (!asset) return null;
  const blob = await getMediaStorage().read(asset.relativePath);
  return createImageBitmap(blob, { imageOrientation: 'from-image' });
};

export const renderCaptainId = async (input: CaptainIdFields) => {
  const fields = sanitizeCaptainIdFields(input);
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1920;
  const context = canvas.getContext('2d'); if (!context) throw new Error('Thiết bị không hỗ trợ tạo Space ID.');
  const gradient = context.createLinearGradient(0,0,1080,1920); gradient.addColorStop(0,'#07152f'); gradient.addColorStop(0.48,'#32136b'); gradient.addColorStop(1,'#07111f'); context.fillStyle=gradient; context.fillRect(0,0,1080,1920);
  context.fillStyle='rgba(255,255,255,.08)'; for(let i=0;i<64;i++){const x=(i*173)%1080;const y=(i*271)%1920;context.beginPath();context.arc(x,y,(i%4)+1,0,Math.PI*2);context.fill();}
  context.strokeStyle='#67e8f9'; context.lineWidth=8; context.beginPath(); context.roundRect(64,64,952,1792,54); context.stroke();
  context.textAlign='center'; context.fillStyle='#a5f3fc'; context.font='700 44px system-ui'; context.fillText('NOVASTARS · SPACE ID',540,160);
  context.fillStyle='#fde047'; context.font='900 76px system-ui'; context.fillText(fields.nickname,540,280);
  context.fillStyle='#cbd5e1'; context.font='600 36px system-ui'; context.fillText(fields.title,540,340);

  const avatar = await loadAssetImage(input.avatarAsset).catch(()=>null);
  context.save(); context.beginPath(); context.roundRect(240,410,600,760,72); context.clip();
  if (avatar) { const scale=Math.max(600/avatar.width,760/avatar.height);const width=avatar.width*scale;const height=avatar.height*scale;context.drawImage(avatar,(1080-width)/2,410+(760-height)/2,width,height);avatar.close(); }
  else { context.fillStyle='#172554';context.fillRect(240,410,600,760);context.font='260px system-ui';context.textBaseline='middle';context.fillText(fields.presetAvatar,540,790);context.textBaseline='alphabetic'; }
  context.restore(); context.strokeStyle='#c4b5fd';context.lineWidth=8;context.beginPath();context.roundRect(240,410,600,760,72);context.stroke();

  const flag = await loadAssetImage(input.approvedFlagAsset).catch(()=>null);
  if(flag){context.save();context.beginPath();context.roundRect(730,1020,250,167,22);context.clip();context.drawImage(flag,730,1020,250,167);context.restore();context.strokeStyle='#f8fafc';context.lineWidth=5;context.beginPath();context.roundRect(730,1020,250,167,22);context.stroke();flag.close();}

  const stats=[['KHỐI',String(fields.grade)],['TỔNG SAO',String(fields.totalStars)],['TỌA ĐỘ',String(fields.completedCoordinates)]];
  stats.forEach(([label,value],index)=>{const x=130+index*300;context.fillStyle='rgba(15,23,42,.82)';context.beginPath();context.roundRect(x,1280,260,220,32);context.fill();context.fillStyle='#67e8f9';context.font='700 28px system-ui';context.fillText(label,x+130,1340);context.fillStyle='#fff';context.font='900 70px system-ui';context.fillText(value,x+130,1440);});
  context.fillStyle='#c4b5fd'; context.font='700 34px system-ui'; context.fillText('Mỗi hành trình bắt đầu từ một ngôi sao nhỏ.',540,1635);
  context.fillStyle='#64748b'; context.font='500 25px system-ui'; context.fillText('Thẻ thành tích được tạo và lưu cục bộ trên thiết bị',540,1710);
  const blob = await new Promise<Blob>((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error('Không thể mã hóa Space ID.')),'image/png'));
  return { blob, width: canvas.width, height: canvas.height, filename: buildCaptainIdFilename() };
};
