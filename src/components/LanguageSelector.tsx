import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Language } from '@/types/UserPreferences';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { preferences, setLanguage } = useUserPreferences();
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="language-select" className="text-sm font-medium text-gray-700">
        {t('settings.language')}
      </Label>
      <Select
        value={preferences.language}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger id="language-select" className="w-[180px]">
          <SelectValue placeholder={t('settings.selectLanguage')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('settings.languages.english')}</SelectItem>
          <SelectItem value="da">{t('settings.languages.danish')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector; 