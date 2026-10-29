import React, { useState } from 'react';
import { Service, ServiceCategory } from '../types';
import { SERVICE_VECTOR_ICONS, OtherServicesIcon } from './ServiceIcons';

interface ServiceThumbnailProps {
  service?: Service;
  imageUrl?: string;
  iconKey?: string;
  category?: ServiceCategory;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const ServiceThumbnail: React.FC<ServiceThumbnailProps> = ({
  service,
  imageUrl,
  iconKey,
  category,
  name,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const activeImageUrl = imageUrl !== undefined ? imageUrl : service?.imageUrl;
  const activeIconKey = iconKey !== undefined ? iconKey : service?.iconKey;
  const activeCategory = category !== undefined ? category : service?.category || 'other';
  const activeName = name || service?.nameBn || '';

  // Dimension mapping
  const sizeClasses = {
    xs: 'w-7 h-7 rounded-lg',
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl',
    '2xl': 'w-20 h-20 rounded-3xl',
  };

  // If a custom photo exists and has not failed to load
  if (activeImageUrl && !imageError) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border border-slate-200/90 shadow-2xs bg-white flex items-center justify-center ${sizeClasses[size]} ${className}`}
        title={activeName}
      >
        <img
          src={activeImageUrl}
          alt={activeName}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Determine which vector icon component to render
  const resolveIconComponent = () => {
    // 1. Exact iconKey match
    if (activeIconKey && SERVICE_VECTOR_ICONS[activeIconKey]) {
      return SERVICE_VECTOR_ICONS[activeIconKey];
    }

    // 2. Category-based fallback
    switch (activeCategory) {
      case 'online':
        return SERVICE_VECTOR_ICONS.form;
      case 'government':
        return SERVICE_VECTOR_ICONS.govt;
      case 'printing':
        return SERVICE_VECTOR_ICONS['print-bw'];
      case 'pvc_card':
        return SERVICE_VECTOR_ICONS['pvc-card'];
      case 'farmer':
        return SERVICE_VECTOR_ICONS.farmer;
      case 'tickets':
        return SERVICE_VECTOR_ICONS.bus;
      case 'recharge_bill':
        return SERVICE_VECTOR_ICONS.electricity;
      default:
        return OtherServicesIcon;
    }
  };

  const IconComponent = resolveIconComponent();

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center transition-transform ${sizeClasses[size]} ${className}`}
      title={activeName}
    >
      <IconComponent className="w-full h-full object-contain filter drop-shadow-2xs" />
    </div>
  );
};
