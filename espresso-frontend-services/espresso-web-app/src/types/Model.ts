export interface Model {
    _id: string;
    model_id: string;
    model_name: string;
    model_metadata: {
      角色: string;
      和我的关系: string;
      对我的好感度: string;
      道德感: string;
      幽默感: string;
      年龄: string;
      姓名: string;
      职业: string;
      文化程度: string;
      所在地: string;
      家乡: string;
      聊天文字: string;
      语言: string;
      性格: string;
      相貌: string;
      身材: string;
      特征: string;
      爱好: string;
      讨厌: string;
      癖好: string;
      聊天语气: string;
      聊天喜欢的主题: string;
      聊天习惯: string;
      聊天工具: string;
      聊天场景: string;
      开场问候语类型: string;
      头像地址src: string;
      Lora地址: string;
      image_url: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
    model_type: string;
  };