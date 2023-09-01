import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';
import { OperationStep } from './OperationStep';

export const SupportMaterials = () => {
  return (
    <BaseAccordion
      title={t(
        'Divulgue seu restaurante e potencialize suas vendas com materiais de apoio'
      )}
      description={t(
        'Nossos materiais irão te auxiliar a ter mais vendas com o AppJusto.'
      )}
    >
      <OperationStep
        title={t('Utilize materiais de divulgação digital')}
        description={t(
          'Confira materiais úteis para divulgar o seu restaurante nas redes sociais e whatsapp!'
        )}
        btnLabel={t('Acessar materiais')}
        link="https://drive.google.com/drive/folders/1FMVItN3OCNBuIfgr-Y0JNspcsl5JrwmF"
        eventName="admin_marketing_material_click"
      />
      {/* <OperationStep
        title={t('Flyers e display de mesa')}
        description={t(
          'Disponibilizamos essas ferramentas para seus clientes saberem que você tem um delivery melhor pra todos!'
        )}
        btnLabel={t('Acessar materiais')}
        link="http://localhost:3000"
      /> */}
    </BaseAccordion>
  );
};
